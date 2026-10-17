"use client";

import { useEffect } from "react";

export default function MotionEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    for (const target of targets) {
      if (target.getBoundingClientRect().top < window.innerHeight * 0.92) continue;
      target.classList.add("reveal-ready");
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
