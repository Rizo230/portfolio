"use client";

import { useState } from "react";

const contactMethods = [
  {
    label: "LinkedIn",
    value: "Leo Barnes",
    copyValue: "https://www.linkedin.com/in/leo-barnes-081794278/",
    href: "https://www.linkedin.com/in/leo-barnes-081794278/",
    preferred: true,
  },
  {
    label: "Email",
    value: "leo@leobarnes.dev",
    copyValue: "leo@leobarnes.dev",
    href: "mailto:leo@leobarnes.dev",
    preferred: false,
  },
  {
    label: "GitHub",
    value: "rizo230",
    copyValue: "https://github.com/rizo230",
    href: "https://github.com/rizo230",
    preferred: false,
  },
];

export default function ContactMethods() {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  async function copyToClipboard(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);

    window.setTimeout(() => {
      setCopiedLabel((current) => (current === label ? null : current));
    }, 2000);
  }

  return (
    <ul className="portfolio-contact-methods">
      {contactMethods.map((method) => {
        const isExternal = method.href.startsWith("http");
        const isCopied = copiedLabel === method.label;

        return (
          <li
            key={method.label}
            className={`portfolio-contact-method ${
              method.preferred ? "is-preferred" : ""
            }`}
          >
            <a
              href={method.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className="portfolio-contact-method-link"
            >
              <span className="portfolio-contact-method-label">
                <span>{method.label}</span>
                {method.preferred && (
                  <span className="portfolio-contact-preferred">
                    Preferred
                  </span>
                )}
              </span>
              <span className="portfolio-contact-method-value">
                {method.value}
                {isExternal && (
                  <span aria-hidden="true" className="portfolio-contact-external">
                    ↗
                  </span>
                )}
              </span>
              {isExternal && (
                <span className="sr-only"> (opens in a new tab)</span>
              )}
            </a>

            <button
              type="button"
              onClick={() => copyToClipboard(method.label, method.copyValue)}
              className="portfolio-contact-copy"
              aria-label={`Copy ${method.label}`}
            >
              {isCopied ? "Copied" : "Copy"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
