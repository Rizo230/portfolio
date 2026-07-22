"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About", href: "/about", icon: "user" },
  { label: "Projects", href: "/projects", icon: "grid" },
  { label: "Contact", href: "/contact", icon: "mail" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4 pointer-events-none">
      <nav aria-label="Main navigation" className="portfolio-nav">
        <ul className="flex items-center gap-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`portfolio-nav-link ${isActive ? "is-active" : ""}`}
                >
                  {item.icon ? (
                    <span
                      aria-hidden="true"
                      className={`portfolio-nav-icon portfolio-nav-icon-${item.icon}`}
                    />
                  ) : null}
                  <span className="portfolio-nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
