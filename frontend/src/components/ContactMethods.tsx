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
    value: "leobenjaminbarnes@gmail.com",
    copyValue: "leobenjaminbarnes@gmail.com",
    href: "mailto:leobenjaminbarnes@gmail.com",
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
    <ul className="mt-6 grid gap-3">
      {contactMethods.map((method) => {
        const isExternal = method.href.startsWith("http");
        const isCopied = copiedLabel === method.label;

        return (
          <li
            key={method.label}
            className={`group flex items-center gap-3 rounded-xl border p-4 transition-colors ${
              method.preferred
                ? "border-accent/50 bg-foreground/[0.02] shadow-sm ring-1 ring-accent/15 hover:border-accent/80 hover:bg-accent/10"
                : "border-black/10 bg-foreground/[0.02] hover:border-black/25 hover:bg-foreground/[0.05] dark:border-white/10 dark:hover:border-white/25"
            }`}
          >
            <a
              href={method.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className="min-w-0 flex-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground/60">
                <span>{method.label}</span>
                {method.preferred && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white dark:text-black">
                    Preferred
                  </span>
                )}
              </span>
              <span className="block truncate font-semibold decoration-foreground/30 underline-offset-4 group-hover:underline">
                {method.value}
                {isExternal && (
                  <span aria-hidden="true" className="ml-1 text-foreground/50">
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
              className="shrink-0 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium transition-colors hover:border-accent/50 hover:bg-accent/5 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/10"
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
