"use client";

import { useState, type FormEvent } from "react";
import { SERVICE_OPTIONS } from "@/lib/services";

export default function QuoteForm({ idPrefix }: { idPrefix: string }) {
  const [state, setState] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (!values.email && !values.phone) { setError("Indiquez un email ou un téléphone pour être recontacté."); return; }
    setState("sending"); setError("");
    try {
      const response = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Une erreur est survenue.");
      form.reset(); setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
      setState("idle");
    }
  }

  if (state === "success") return <div className="form-success" role="status"><span aria-hidden="true">✓</span><h3>Demande bien reçue.</h3><p>Merci de nous avoir contactés. Nous reviendrons vers vous au moyen indiqué.</p><button type="button" onClick={() => setState("idle")}>Envoyer une autre demande</button></div>;

  return <form className="quote-form" onSubmit={submit}>
    <div className="field"><label htmlFor={`${idPrefix}-service`}>Votre projet <span>*</span></label><select id={`${idPrefix}-service`} name="service" required defaultValue=""><option value="" disabled>Choisir un type de travaux</option>{SERVICE_OPTIONS.map((option) => <option value={option} key={option}>{option}</option>)}</select></div>
    <div className="field-row"><div className="field"><label htmlFor={`${idPrefix}-name`}>Votre nom <span>*</span></label><input id={`${idPrefix}-name`} name="name" autoComplete="name" placeholder="Nom et prénom" required maxLength={100} /></div><div className="field"><label htmlFor={`${idPrefix}-city`}>Votre commune <span>*</span></label><input id={`${idPrefix}-city`} name="city" autoComplete="address-level2" placeholder="Ex. Valenciennes" required maxLength={100} /></div></div>
    <div className="field-row"><div className="field"><label htmlFor={`${idPrefix}-email`}>Email</label><input id={`${idPrefix}-email`} name="email" type="email" autoComplete="email" placeholder="vous@exemple.fr" maxLength={180} /></div><div className="field"><label htmlFor={`${idPrefix}-phone`}>Téléphone</label><input id={`${idPrefix}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="Pour vous rappeler" maxLength={40} /></div></div>
    <p className="field-hint">Renseignez au moins un moyen de contact.</p>
    <div className="field"><label htmlFor={`${idPrefix}-details`}>Quelques mots sur votre projet <span>*</span></label><textarea id={`${idPrefix}-details`} name="details" placeholder="Décrivez votre besoin, même en quelques phrases…" rows={3} required minLength={8} maxLength={2000} /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor={`${idPrefix}-website`}>Site web</label><input id={`${idPrefix}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="submit-button" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi en cours…" : "Demander mon devis"}<span aria-hidden="true">↗</span></button>
    <p className="form-privacy">Vos informations servent uniquement à répondre à votre demande. <a href="/confidentialite">En savoir plus</a>.</p>
  </form>;
}
