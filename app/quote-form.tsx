"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, X } from "lucide-react";
import { SERVICE_OPTIONS } from "@/lib/services";

export default function QuoteForm({ idPrefix, defaultCity }: { idPrefix: string; defaultCity?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "success">("idle");
  const [service, setService] = useState("");
  const [city, setCity] = useState(defaultCity ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function reset() {
    setState("idle");
    setService("");
    setCity(defaultCity ?? "");
    setName("");
    setEmail("");
    setPhone("");
    setError("");
  }

  function continueStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (city.trim().length < 2) {
      setError("Indiquez votre commune ou votre secteur.");
      return;
    }
    setError("");
    dialogRef.current?.showModal();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Indiquez votre nom.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError("Indiquez un e-mail ou un téléphone pour être recontacté.");
      return;
    }
    if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "1") {
      setError("Version de présentation : le formulaire n’envoie pas de demande.");
      return;
    }
    const values = {
      service,
      city: city.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: new FormData(event.currentTarget).get("website") || "",
    };
    setState("sending"); setError("");
    try {
      const response = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Une erreur est survenue.");
      setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
      setState("idle");
    }
  }

  return <>
    <form className="quote-form" onSubmit={continueStep}>
      <div className="field"><label htmlFor={`${idPrefix}-service`}>Type de projet <span>*</span></label><select id={`${idPrefix}-service`} name="service" required value={service} onChange={(event) => setService(event.target.value)}><option value="" disabled>Choisir un type de travaux</option>{SERVICE_OPTIONS.map((option) => <option value={option} key={option}>{option}</option>)}</select></div>
      <div className="field"><label htmlFor={`${idPrefix}-city`}>Votre secteur / commune <span>*</span></label><input id={`${idPrefix}-city`} name="city" autoComplete="address-level2" placeholder="Ex. Valenciennes" required maxLength={100} value={city} onChange={(event) => setCity(event.target.value)} /></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="submit-button" type="submit">Continuer <span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></button>
    </form>
    <dialog
      ref={dialogRef}
      className="review-modal quote-modal"
      aria-labelledby={`${idPrefix}-quote-modal-title`}
      onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
      onClose={() => { setError(""); if (state === "success") reset(); }}
    >
      <div className="review-modal-card">
        <div className="review-modal-header">
          <div>
            <span className="eyebrow">DERNIÈRE ÉTAPE</span>
            <h2 id={`${idPrefix}-quote-modal-title`}>Comment vous joindre&nbsp;?</h2>
          </div>
          <button type="button" className="review-modal-close" onClick={() => dialogRef.current?.close()} aria-label="Fermer le formulaire de contact"><X size={22} /></button>
        </div>
        {state === "success" ? (
          <div className="form-success" role="status"><span aria-hidden="true"><Check size={22} /></span><h3>Demande bien reçue.</h3><p>Merci de nous avoir contactés. Nous reviendrons vers vous au moyen indiqué.</p><button type="button" onClick={() => dialogRef.current?.close()}>Envoyer une autre demande <span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></button></div>
        ) : (
          <form className="quote-step-form" onSubmit={submit}>
            <div className="field"><label htmlFor={`${idPrefix}-name`}>Votre nom <span>*</span></label><input id={`${idPrefix}-name`} name="name" autoComplete="name" placeholder="Nom et prénom" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} autoFocus /></div>
            <div className="field-row"><div className="field"><label htmlFor={`${idPrefix}-email`}>Email</label><input id={`${idPrefix}-email`} name="email" type="email" autoComplete="email" placeholder="vous@exemple.fr" maxLength={180} value={email} onChange={(event) => setEmail(event.target.value)} /></div><div className="field"><label htmlFor={`${idPrefix}-phone`}>Téléphone</label><input id={`${idPrefix}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="Pour vous rappeler" minLength={7} maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} /></div></div>
            <p className="contact-step-hint">Indiquez au moins un e-mail ou un numéro de téléphone.</p>
            <div className="honeypot" aria-hidden="true"><label htmlFor={`${idPrefix}-website`}>Site web</label><input id={`${idPrefix}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="form-actions"><button className="form-back" type="button" onClick={() => dialogRef.current?.close()}><ArrowLeft size={16} aria-hidden="true" /> Retour</button><button className="submit-button" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi en cours…" : "Demander mon devis"}<span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></button></div>
            <p className="form-privacy">Vos informations servent uniquement à répondre à votre demande. <Link href="/confidentialite">En savoir plus</Link>.</p>
          </form>
        )}
      </div>
    </dialog>
  </>;
}
