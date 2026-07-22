package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/netip"
	"testing"
	"time"
)

type fakeEmailSender struct {
	id      string
	count   int
	request contactRequest
	err     error
}

func (s *fakeEmailSender) SendContactEmail(_ context.Context, request contactRequest) (string, error) {
	s.count++
	s.request = request
	if s.err != nil {
		return "", s.err
	}

	return s.id, nil
}

type fakeChallengeVerifier struct {
	err error
}

func (v fakeChallengeVerifier) Verify(context.Context, string, string) error {
	return v.err
}

func TestValidateContactRequest(t *testing.T) {
	valid := contactRequest{
		Name:           "Leo",
		Email:          "leo@example.com",
		Message:        "Hello",
		TurnstileToken: "token",
	}

	if err := validateContactRequest(valid); err != nil {
		t.Fatalf("expected valid request, got %v", err)
	}

	invalid := valid
	invalid.Email = "not-an-email"
	if err := validateContactRequest(invalid); err == nil {
		t.Fatal("expected invalid email to fail validation")
	}
}

func TestContactHandlerSendsEmail(t *testing.T) {
	sender := &fakeEmailSender{id: "email_123"}
	body := bytes.NewBufferString(`{"name":" Leo ","email":"leo@example.com","message":" Hello ","turnstileToken":"token"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/contact", body)
	response := httptest.NewRecorder()

	contactHandler(sender, fakeChallengeVerifier{}, newRateLimiter(rateLimitMax, rateLimitWindow), true, nil).ServeHTTP(response, request)

	if response.Code != http.StatusAccepted {
		t.Fatalf("expected status %d, got %d", http.StatusAccepted, response.Code)
	}

	if sender.request.Name != "Leo" || sender.request.Message != "Hello" {
		t.Fatalf("expected normalized request, got %#v", sender.request)
	}

	var payload contactResponse
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if payload.ID != "email_123" {
		t.Fatalf("expected response id email_123, got %q", payload.ID)
	}
}

func TestContactHandlerRejectsMissingSender(t *testing.T) {
	body := bytes.NewBufferString(`{"name":"Leo","email":"leo@example.com","message":"Hello","turnstileToken":"token"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/contact", body)
	response := httptest.NewRecorder()

	contactHandler(nil, fakeChallengeVerifier{}, newRateLimiter(rateLimitMax, rateLimitWindow), true, nil).ServeHTTP(response, request)

	if response.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected status %d, got %d", http.StatusServiceUnavailable, response.Code)
	}
}

func TestContactHandlerReportsSendFailure(t *testing.T) {
	sender := &fakeEmailSender{err: errors.New("resend failed")}
	body := bytes.NewBufferString(`{"name":"Leo","email":"leo@example.com","message":"Hello","turnstileToken":"token"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/contact", body)
	response := httptest.NewRecorder()

	contactHandler(sender, fakeChallengeVerifier{}, newRateLimiter(rateLimitMax, rateLimitWindow), true, nil).ServeHTTP(response, request)

	if response.Code != http.StatusBadGateway {
		t.Fatalf("expected status %d, got %d", http.StatusBadGateway, response.Code)
	}
}

func TestContactHandlerSuppressesHoneypotSubmissions(t *testing.T) {
	sender := &fakeEmailSender{id: "email_123"}
	body := bytes.NewBufferString(`{"name":"Leo","email":"leo@example.com","message":"Hello","website":"https://spam.example","turnstileToken":"token"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/contact", body)
	response := httptest.NewRecorder()

	contactHandler(sender, fakeChallengeVerifier{}, newRateLimiter(rateLimitMax, rateLimitWindow), true, nil).ServeHTTP(response, request)

	if response.Code != http.StatusAccepted {
		t.Fatalf("expected status %d, got %d", http.StatusAccepted, response.Code)
	}

	if sender.count != 0 {
		t.Fatalf("expected honeypot submission not to send email, sent %d emails", sender.count)
	}
}

func TestContactHandlerRateLimitsByIP(t *testing.T) {
	sender := &fakeEmailSender{id: "email_123"}
	limiter := newRateLimiter(1, 10*time.Minute)

	for i := 0; i < 2; i++ {
		body := bytes.NewBufferString(`{"name":"Leo","email":"leo@example.com","message":"Hello","turnstileToken":"token"}`)
		request := httptest.NewRequest(http.MethodPost, "/api/contact", body)
		request.RemoteAddr = "203.0.113.10:1234"
		response := httptest.NewRecorder()

		contactHandler(sender, fakeChallengeVerifier{}, limiter, true, nil).ServeHTTP(response, request)

		if i == 0 && response.Code != http.StatusAccepted {
			t.Fatalf("expected first request status %d, got %d", http.StatusAccepted, response.Code)
		}

		if i == 1 && response.Code != http.StatusTooManyRequests {
			t.Fatalf("expected second request status %d, got %d", http.StatusTooManyRequests, response.Code)
		}
	}
}

func TestContactHandlerRejectsFailedChallenge(t *testing.T) {
	sender := &fakeEmailSender{id: "email_123"}
	body := bytes.NewBufferString(`{"name":"Leo","email":"leo@example.com","message":"Hello","turnstileToken":"token"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/contact", body)
	response := httptest.NewRecorder()

	contactHandler(sender, fakeChallengeVerifier{err: errors.New("bad token")}, newRateLimiter(rateLimitMax, rateLimitWindow), true, nil).ServeHTTP(response, request)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
	}

	if sender.count != 0 {
		t.Fatalf("expected failed challenge not to send email, sent %d emails", sender.count)
	}
}

func TestClientIPIgnoresForwardedHeadersFromUntrustedClients(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/contact", nil)
	request.RemoteAddr = "203.0.113.10:1234"
	request.Header.Set("X-Forwarded-For", "198.51.100.20")
	request.Header.Set("CF-Connecting-IP", "198.51.100.30")

	clientIP := clientIPFromRequest(request, nil)

	if clientIP != "203.0.113.10" {
		t.Fatalf("expected remote address, got %q", clientIP)
	}
}

func TestClientIPUsesForwardedHeadersFromTrustedProxy(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/contact", nil)
	request.RemoteAddr = "172.18.0.4:1234"
	request.Header.Set("X-Forwarded-For", "198.51.100.20, 172.18.0.4")

	trustedProxy := netip.MustParsePrefix("172.16.0.0/12")
	clientIP := clientIPFromRequest(request, []netip.Prefix{trustedProxy})

	if clientIP != "198.51.100.20" {
		t.Fatalf("expected forwarded client IP, got %q", clientIP)
	}
}
