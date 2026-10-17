"use client";

import { useState, type FormEvent } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Connexion impossible.");
      window.location.reload();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Connexion impossible."); setBusy(false); }
  }
  return <main className="admin-login"><span className="eyebrow">ESPACE PRIVÉ</span><h1>Connexion</h1><form onSubmit={submit}><div className="field"><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" autoComplete="username" required /></div><div className="field"><label htmlFor="admin-password">Mot de passe</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required /></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="submit-button" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}<span aria-hidden="true">↗</span></button></form></main>;
}
