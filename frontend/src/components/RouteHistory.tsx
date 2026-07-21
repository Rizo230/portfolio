"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteHistory() {
  const pathname = usePathname();

  useEffect(() => {
    const currentPath = sessionStorage.getItem("portfolio:currentPath");

    if (currentPath === pathname) {
      return;
    }

    if (currentPath) {
      sessionStorage.setItem("portfolio:previousPath", currentPath);
    }

    sessionStorage.setItem("portfolio:currentPath", pathname);
  }, [pathname]);

  return null;
}
