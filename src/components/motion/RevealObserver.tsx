"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal for any element marked `data-reveal`: it is "armed" (hidden by CSS) on
 * mount and gets `data-revealed` the first time it enters the viewport.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => {
      el.setAttribute("data-armed", "");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
