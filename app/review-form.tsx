"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

export default function ReviewForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");

  function close() {
    dialogRef.current?.close();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "1") {
      setError("Version de présentation : l’avis n’est pas envoyé.");
      return;
    }
    const form = event.currentTarget;
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Une erreur est survenue.");
      form.reset();
      setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
      setState("idle");
    }
  }

  return <>
    <button type="button" className="review-trigger" onClick={() => dialogRef.current?.showModal()}>
      Laisser un avis <span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span>
    </button>
    <dialog
      ref={dialogRef}
      className="review-modal"
      aria-labelledby="review-modal-title"
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      onClose={() => { setError(""); setState("idle"); }}
    >
      <div className="review-modal-card">
        <div className="review-modal-header">
          <div>
            <span className="eyebrow">VOTRE EXPÉRIENCE</span>
            <h2 id="review-modal-title">Laisser un avis</h2>
          </div>
          <button type="button" className="review-modal-close" onClick={close} aria-label="Fermer le formulaire d’avis"><X size={22} /></button>
        </div>
        {state === "success" ? (
          <p className="review-thanks" role="status">Merci pour votre retour. Votre avis sera visible après validation.</p>
        ) : (
          <form className="review-form" onSubmit={submit}>
            <div className="field-row">
              <div className="field"><label htmlFor="review-author">Votre nom *</label><input id="review-author" name="author" required maxLength={80} /></div>
              <div className="field"><label htmlFor="review-city">Votre commune</label><input id="review-city" name="city" maxLength={80} /></div>
            </div>
            <div className="field"><label htmlFor="review-rating">Votre note *</label><select id="review-rating" name="rating" required defaultValue=""><option value="" disabled>Choisir une note</option>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></div>
            <div className="field"><label htmlFor="review-message">Votre expérience *</label><textarea id="review-message" name="message" rows={4} required minLength={12} maxLength={1200} /></div>
            <div className="honeypot" aria-hidden="true"><label htmlFor="review-website">Site web</label><input id="review-website" name="website" tabIndex={-1} autoComplete="off" /></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="submit-button" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : "Envoyer mon avis"}<span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></button>
            <p className="form-privacy">Votre nom, votre commune et votre avis peuvent être publiés sur le site après validation. <Link href="/confidentialite">En savoir plus</Link>.</p>
          </form>
        )}
      </div>
    </dialog>
  </>;
}
