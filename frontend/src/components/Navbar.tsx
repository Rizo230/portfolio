"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/90 backdrop-blur dark:border-white/10">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6"
      >
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className={`inline-flex h-full items-center border-x px-3 text-lg font-semibold tracking-tight transition-colors hover:bg-foreground/[0.05] focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:px-5 ${
            pathname === "/"
              ? "border-accent/50 bg-accent/5 text-accent"
              : "border-transparent"
          }`}
        >
          Leo Barnes
        </Link>

        <ul className="flex h-full items-stretch text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href} className="h-full">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-full items-center border-x px-3 text-foreground/70 transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:px-5 ${
                    isActive
                      ? "border-accent/50 bg-accent/5 text-accent"
                      : "border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
