"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#services", label: "Savoir-faire" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#avis", label: "Avis" },
  { href: "#devis", label: "Contact" },
];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        openerRef.current?.focus();
      } else if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    openerRef.current?.focus();
  };

  return (
    <div className="mobile-navigation">
      <button
        ref={openerRef}
        className="mobile-menu-opener"
        type="button"
        aria-label="Ouvrir le menu"
        aria-controls="mobile-site-menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={22} strokeWidth={2} aria-hidden="true" />
      </button>
      <div className={`mobile-menu-layer${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <button className="mobile-menu-backdrop" type="button" tabIndex={-1} aria-label="Fermer le menu" onClick={closeMenu} />
        <div ref={panelRef} className="mobile-menu-panel">
          <div className="mobile-menu-top">
            <span>Navigation</span>
            <button ref={closeRef} className="mobile-menu-close" type="button" aria-label="Fermer le menu" onClick={closeMenu}>
              <X size={23} aria-hidden="true" />
            </button>
          </div>
          <nav id="mobile-site-menu" className="mobile-menu-links" aria-label="Navigation principale">
            {links.map((link, index) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {link.label}
              </a>
            ))}
          </nav>
          <p className="mobile-menu-note">BÂTI POOL · BÂTIMENT & PISCINES</p>
        </div>
      </div>
    </div>
  );
}
