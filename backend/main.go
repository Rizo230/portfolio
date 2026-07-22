package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"io"
	"log"
	"net"
	"net/http"
	"net/mail"
	"net/netip"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/resend/resend-go/v2"
)

const (
	defaultPort         = "8090"
	rateLimitMax        = 5
	rateLimitWindow     = 10 * time.Minute
	turnstileVerifyURL  = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
	turnstileMaxBodyLen = 32 * 1024
)

type config struct {
	port              string
	frontendURL       string
	resendAPIKey      string
	resendFrom        string
	contactTo         string
	turnstileSecret   string
	turnstileRequired bool
}

type contactRequest struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Message        string `json:"message"`
	Website        string `json:"website"`
	TurnstileToken string `json:"turnstileToken"`
}

type contactResponse struct {
	Message string `json:"message"`
	ID      string `json:"id,omitempty"`
}

type emailSender interface {
	SendContactEmail(context.Context, contactRequest) (string, error)
}

type challengeVerifier interface {
	Verify(context.Context, string, string) error
}

type resendEmailSender struct {
	client *resend.Client
	from   string
	to     string
}

type turnstileVerifier struct {
	client *http.Client
	secret string
}

type turnstileResponse struct {
	Success    bool     `json:"success"`
	ErrorCodes []string `json:"error-codes"`
}

type rateLimiter struct {
	mu       sync.Mutex
	max      int
	window   time.Duration
	requests map[string][]time.Time
}

func main() {
	if err := loadEnvFile(".env"); err != nil && !errors.Is(err, os.ErrNotExist) {
		log.Printf("Failed to load .env: %v", err)
	}

	cfg := loadConfig()
	var sender emailSender
	var verifier challengeVerifier
	if cfg.resendAPIKey == "" {
		log.Println("RESEND_API_KEY is not configured; POST /api/contact will be unavailable")
	} else {
		sender = resendEmailSender{
			client: resend.NewClient(cfg.resendAPIKey),
			from:   cfg.resendFrom,
			to:     cfg.contactTo,
		}
	}

	if cfg.turnstileRequired && cfg.turnstileSecret == "" {
		log.Println("TURNSTILE_SECRET_KEY is not configured; POST /api/contact will be unavailable")
	} else if cfg.turnstileRequired {
		verifier = turnstileVerifier{
			client: &http.Client{Timeout: 5 * time.Second},
			secret: cfg.turnstileSecret,
		}
	}

	limiter := newRateLimiter(rateLimitMax, rateLimitWindow)
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	mux.Handle("POST /api/contact", withCORS(contactHandler(sender, verifier, limiter, cfg.turnstileRequired), cfg.frontendURL))
	mux.Handle("OPTIONS /api/contact", withCORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	}), cfg.frontendURL))

	addr := ":" + cfg.port
	server := &http.Server{
		Addr:              addr,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("Portfolio API listening on %s", addr)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}

func loadConfig() config {
	return config{
		port:              envOrDefault("PORT", defaultPort),
		frontendURL:       envOrDefault("FRONTEND_ORIGIN", "http://localhost:3001"),
		resendAPIKey:      strings.TrimSpace(os.Getenv("RESEND_API_KEY")),
		resendFrom:        envOrDefault("RESEND_FROM_EMAIL", "Portfolio <onboarding@resend.dev>"),
		contactTo:         envOrDefault("CONTACT_TO_EMAIL", "leobenjaminbarnes@gmail.com"),
		turnstileSecret:   strings.TrimSpace(os.Getenv("TURNSTILE_SECRET_KEY")),
		turnstileRequired: envBoolOrDefault("TURNSTILE_REQUIRED", true),
	}
}

func contactHandler(sender emailSender, verifier challengeVerifier, limiter *rateLimiter, requireChallenge bool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if sender == nil {
			writeJSON(w, http.StatusServiceUnavailable, contactResponse{
				Message: "Email service is not configured.",
			})
			return
		}

		if requireChallenge && verifier == nil {
			writeJSON(w, http.StatusServiceUnavailable, contactResponse{
				Message: "CAPTCHA service is not configured.",
			})
			return
		}

		r.Body = http.MaxBytesReader(w, r.Body, 16*1024)
		var payload contactRequest
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		if err := decoder.Decode(&payload); err != nil {
			writeJSON(w, http.StatusBadRequest, contactResponse{
				Message: "Please send a valid contact request.",
			})
			return
		}

		payload = normalizeContactRequest(payload)
		if payload.Website != "" {
			writeJSON(w, http.StatusAccepted, contactResponse{
				Message: "Message sent.",
			})
			return
		}

		if err := validateContactRequest(payload); err != nil {
			writeJSON(w, http.StatusBadRequest, contactResponse{
				Message: err.Error(),
			})
			return
		}

		clientIP := clientIPFromRequest(r)
		if !limiter.Allow(clientIP) {
			writeJSON(w, http.StatusTooManyRequests, contactResponse{
				Message: "Too many messages from this network. Please try again later.",
			})
			return
		}

		if requireChallenge {
			if err := validateTurnstileToken(payload.TurnstileToken); err != nil {
				writeJSON(w, http.StatusBadRequest, contactResponse{
					Message: err.Error(),
				})
				return
			}

			if err := verifier.Verify(r.Context(), payload.TurnstileToken, clientIP); err != nil {
				log.Printf("Failed to verify CAPTCHA: %v", err)
				writeJSON(w, http.StatusBadRequest, contactResponse{
					Message: "CAPTCHA verification failed. Please try again.",
				})
				return
			}
		}

		id, err := sender.SendContactEmail(r.Context(), payload)
		if err != nil {
			log.Printf("Failed to send contact email: %v", err)
			writeJSON(w, http.StatusBadGateway, contactResponse{
				Message: "Message could not be sent right now.",
			})
			return
		}

		writeJSON(w, http.StatusAccepted, contactResponse{
			Message: "Message sent.",
			ID:      id,
		})
	})
}

func (s resendEmailSender) SendContactEmail(ctx context.Context, request contactRequest) (string, error) {
	subject := fmt.Sprintf("Portfolio contact from %s", request.Name)
	text := fmt.Sprintf("Name: %s\nEmail: %s\n\n%s", request.Name, request.Email, request.Message)
	htmlBody := fmt.Sprintf(
		"<p><strong>Name:</strong> %s</p><p><strong>Email:</strong> %s</p><p>%s</p>",
		html.EscapeString(request.Name),
		html.EscapeString(request.Email),
		strings.ReplaceAll(html.EscapeString(request.Message), "\n", "<br>"),
	)

	response, err := s.client.Emails.SendWithContext(ctx, &resend.SendEmailRequest{
		From:    s.from,
		To:      []string{s.to},
		ReplyTo: request.Email,
		Subject: subject,
		Text:    text,
		Html:    htmlBody,
		Tags: []resend.Tag{
			{Name: "source", Value: "portfolio-contact-form"},
		},
	})
	if err != nil {
		return "", err
	}

	return response.Id, nil
}

func normalizeContactRequest(request contactRequest) contactRequest {
	return contactRequest{
		Name:           strings.TrimSpace(request.Name),
		Email:          strings.TrimSpace(request.Email),
		Message:        strings.TrimSpace(request.Message),
		Website:        strings.TrimSpace(request.Website),
		TurnstileToken: strings.TrimSpace(request.TurnstileToken),
	}
}

func validateContactRequest(request contactRequest) error {
	if request.Name == "" {
		return errors.New("Please include your name.")
	}

	if len(request.Name) > 120 {
		return errors.New("Name must be 120 characters or fewer.")
	}

	if request.Email == "" {
		return errors.New("Please include your email address.")
	}

	if _, err := mail.ParseAddress(request.Email); err != nil {
		return errors.New("Please include a valid email address.")
	}

	if request.Message == "" {
		return errors.New("Please include a message.")
	}

	if len(request.Message) > 4000 {
		return errors.New("Message must be 4000 characters or fewer.")
	}

	return nil
}

func validateTurnstileToken(token string) error {
	if token == "" {
		return errors.New("Please complete the CAPTCHA.")
	}

	return nil
}

func (v turnstileVerifier) Verify(ctx context.Context, token string, remoteIP string) error {
	body := map[string]string{
		"secret":   v.secret,
		"response": token,
	}

	if remoteIP != "" {
		body["remoteip"] = remoteIP
	}

	encoded, err := json.Marshal(body)
	if err != nil {
		return err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, turnstileVerifyURL, bytes.NewReader(encoded))
	if err != nil {
		return err
	}
	request.Header.Set("Content-Type", "application/json")

	response, err := v.client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	bodyReader := io.LimitReader(response.Body, turnstileMaxBodyLen)
	var payload turnstileResponse
	if err := json.NewDecoder(bodyReader).Decode(&payload); err != nil {
		return err
	}

	if !payload.Success {
		if len(payload.ErrorCodes) > 0 {
			return fmt.Errorf("turnstile rejected token: %s", strings.Join(payload.ErrorCodes, ", "))
		}

		return errors.New("turnstile rejected token")
	}

	return nil
}

func newRateLimiter(max int, window time.Duration) *rateLimiter {
	return &rateLimiter{
		max:      max,
		window:   window,
		requests: make(map[string][]time.Time),
	}
}

func (l *rateLimiter) Allow(key string) bool {
	if key == "" {
		key = "unknown"
	}

	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-l.window)
	requests := l.requests[key]
	kept := requests[:0]

	for _, timestamp := range requests {
		if timestamp.After(cutoff) {
			kept = append(kept, timestamp)
		}
	}

	if len(kept) >= l.max {
		l.requests[key] = kept
		return false
	}

	l.requests[key] = append(kept, now)
	return true
}

func clientIPFromRequest(r *http.Request) string {
	for _, header := range []string{"CF-Connecting-IP", "X-Real-IP", "X-Forwarded-For"} {
		value := strings.TrimSpace(r.Header.Get(header))
		if value == "" {
			continue
		}

		if header == "X-Forwarded-For" {
			value, _, _ = strings.Cut(value, ",")
			value = strings.TrimSpace(value)
		}

		if addr, err := netip.ParseAddr(value); err == nil {
			return addr.String()
		}
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		host = r.RemoteAddr
	}

	if addr, err := netip.ParseAddr(host); err == nil {
		return addr.String()
	}

	return host
}

func withCORS(next http.Handler, allowedOrigin string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Origin") == allowedOrigin {
			w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}

func envOrDefault(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	return value
}

func envBoolOrDefault(key string, fallback bool) bool {
	value := strings.ToLower(strings.TrimSpace(os.Getenv(key)))
	if value == "" {
		return fallback
	}

	return value == "1" || value == "true" || value == "yes"
}

func loadEnvFile(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		line = strings.TrimPrefix(line, "export ")
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}

		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}

		if _, exists := os.LookupEnv(key); exists {
			continue
		}

		value = strings.TrimSpace(value)
		value = strings.Trim(value, `"'`)
		if err := os.Setenv(key, value); err != nil {
			return err
		}
	}

	return scanner.Err()
}
