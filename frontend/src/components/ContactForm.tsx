"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

type ContactResponse = {
  message?: string;
};

declare global {
  interface Window {
    contactTurnstileOnLoad?: () => void;
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "auto" | "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8090";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaStatus, setCaptchaStatus] = useState("CAPTCHA is loading.");
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const renderTurnstile = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !captchaRef.current ||
      !window.turnstile ||
      turnstileWidgetId.current
    ) {
      return;
    }

    turnstileWidgetId.current = window.turnstile.render(captchaRef.current, {
      sitekey: turnstileSiteKey,
      theme: "dark",
      callback: (token) => {
        setTurnstileToken(token);
        setCaptchaStatus("");
      },
      "expired-callback": () => {
        setTurnstileToken("");
        setCaptchaStatus("CAPTCHA expired. Please try again.");
      },
      "error-callback": () => {
        setTurnstileToken("");
        setCaptchaStatus("CAPTCHA could not load. Please refresh and try again.");
      },
    });
  }, []);

  useEffect(() => {
    window.contactTurnstileOnLoad = renderTurnstile;
    renderTurnstile();

    return () => {
      if (window.contactTurnstileOnLoad === renderTurnstile) {
        window.contactTurnstileOnLoad = undefined;
      }
    };
  }, [renderTurnstile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("submitting");
    setStatusMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
          turnstileToken,
        }),
      });

      const payload = (await response
        .json()
        .catch(() => ({}))) as ContactResponse;

      if (!response.ok) {
        throw new Error(payload.message ?? "Message could not be sent.");
      }

      form.reset();
      setTurnstileToken("");
      window.turnstile?.reset(turnstileWidgetId.current ?? undefined);
      setSubmitState("success");
      setStatusMessage("Thanks, your message has been sent.");
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Message could not be sent right now.",
      );
    }
  }

  const isSubmitting = submitState === "submitting";

  return (
    <>
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=contactTurnstileOnLoad"
          strategy="afterInteractive"
          onReady={renderTurnstile}
        />
      )}

      <form onSubmit={handleSubmit} className="portfolio-contact-form">
        <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="portfolio-contact-field">
          <label htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className="portfolio-contact-input"
          />
        </div>

        <div className="portfolio-contact-field">
          <label htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className="portfolio-contact-input"
          />
        </div>

        <div className="portfolio-contact-field">
          <label htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={4000}
            rows={7}
            className="portfolio-contact-input portfolio-contact-message"
          />
        </div>

        {turnstileSiteKey ? (
          <div className="portfolio-contact-captcha">
            <div ref={captchaRef} />
            {captchaStatus ? (
              <p className="portfolio-contact-captcha-status">
                {captchaStatus}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="portfolio-contact-error">CAPTCHA is not configured.</p>
        )}

        <div className="portfolio-contact-actions">
          <button
            type="submit"
            disabled={isSubmitting || !turnstileSiteKey || !turnstileToken}
            className="portfolio-contact-submit"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>

          <p
            role="status"
            className={`portfolio-contact-status ${
              submitState === "error" ? "is-error" : ""
            }`}
          >
            {statusMessage}
          </p>
        </div>
      </form>
    </>
  );
}
