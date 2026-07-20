"use client";

import Script from "next/script";
import { useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

type ContactResponse = {
  message?: string;
};

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
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
          turnstileToken: formData.get("cf-turnstile-response"),
        }),
      });

      const payload = (await response
        .json()
        .catch(() => ({}))) as ContactResponse;

      if (!response.ok) {
        throw new Error(payload.message ?? "Message could not be sent.");
      }

      form.reset();
      window.turnstile?.reset();
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
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-2xl border border-black/10 p-6 dark:border-white/10 sm:p-8"
      >
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

        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-semibold">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className="min-h-11 rounded-lg border border-black/10 bg-transparent px-3 py-2 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className="min-h-11 rounded-lg border border-black/10 bg-transparent px-3 py-2 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm font-semibold">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={4000}
            rows={7}
            className="resize-y rounded-lg border border-black/10 bg-transparent px-3 py-2 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10"
          />
        </div>

        {turnstileSiteKey ? (
          <div
            className="cf-turnstile min-h-[65px]"
            data-sitekey={turnstileSiteKey}
            data-theme="auto"
          />
        ) : (
          <p className="text-sm text-red-600">CAPTCHA is not configured.</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSubmitting || !turnstileSiteKey}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:text-black"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>

          <p
            role="status"
            className={`min-h-6 text-sm ${
              submitState === "error" ? "text-red-600" : "text-foreground/70"
            }`}
          >
            {statusMessage}
          </p>
        </div>
      </form>
    </>
  );
}
