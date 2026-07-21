"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

const profileRoutes = new Set(["/", "/about"]);

type ProfileCardFrameProps = {
  children: ReactNode;
  className: string;
};

export default function ProfileCardFrame({
  children,
  className,
}: ProfileCardFrameProps) {
  const cardRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const previousPath = sessionStorage.getItem("portfolio:currentPath");

    if (previousPath === null || profileRoutes.has(previousPath)) {
      return;
    }

    cardRef.current?.classList.add("is-route-entering");
  }, []);

  return (
    <aside ref={cardRef} className={className}>
      {children}
    </aside>
  );
}
