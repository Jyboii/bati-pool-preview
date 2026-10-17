"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import RatingStars from "../rating-stars";

type Quote = { id: string; createdAt: number; name: string; city: string; service: string; email: string | null; phone: string | null; details: string; status: string };
type Review = { id: string; createdAt: number; author: string; city: string | null; rating: number; message: string; status: string };
type Photo = { slot: string; src: string; alt: string; title: string; label: string };

async function preparePhoto(file: File) {
  if (file.size < 850_000) return file;
  const bitmap = await createImageBitmap(file);
  let output: Blob | null = null;
  for (const [limit, quality] of [[1800, .78], [1400, .68], [1100, .62]]) {
    const scale = Math.min(1, limit / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    output = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (output && output.size < 900_000) break;
  }
  bitmap.close();
  if (!output || output.size > 900_000) throw new Error("Cette image est trop volumineuse. Choisissez une autre photo.");
  return new File([output], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

function AdminPanel({ quotes, reviews, photos }: { quotes: Quote[]; reviews: Review[]; photos: Photo[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  async function action(payload: Record<string, unknown>) {
    setError(""); setBusy(String(payload.id || payload.slot));
    try {
      const response = await fetch("/api/admin/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Action impossible.");
      router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Action impossible."); } finally { setBusy(""); }
  }
  async function upload(event: FormEvent<HTMLFormElement>, slot: string) {
    event.preventDefault(); setError(""); setBusy(slot);
    const form = event.currentTarget;
    try {
      const data = new FormData(form);
      const selected = data.get("file");
      if (!(selected instanceof File)) throw new Error("Choisissez une photo.");
      const prepared = await preparePhoto(selected);
      data.set("file", prepared, prepared.name);
      const response = await fetch("/api/admin/gallery", { method: "POST", body: data });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Envoi impossible.");
      form.reset(); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Envoi impossible."); } finally { setBusy(""); }
  }
  return <main className="admin-content"><span className="eyebrow">ESPACE DE GESTION</span><h1>Tableau de bord</h1>{error && <p className="form-error" role="alert">{error}</p>}
    <section className="admin-section"><h2>Demandes de devis <small>({quotes.length})</small></h2>{quotes.length ? <div className="admin-table">{quotes.map((quote) => <article className="admin-record" key={quote.id}><div><h3>{quote.name} · {quote.service}</h3><small>{new Date(quote.createdAt).toLocaleString("fr-FR")} · {quote.city}</small><p>{quote.details}</p><p>{quote.email && <a href={`mailto:${quote.email}`}>{quote.email}</a>}{quote.email && quote.phone ? " · " : ""}{quote.phone && <a href={`tel:${quote.phone}`}>{quote.phone}</a>}</p></div><div className="admin-controls"><select aria-label={`Statut de la demande de ${quote.name}`} value={quote.status} disabled={busy === quote.id} onChange={(event) => action({ kind: "quote", id: quote.id, status: event.target.value })}><option value="nouveau">Nouveau</option><option value="contacté">Contacté</option><option value="clos">Clos</option></select><button disabled={busy === quote.id} onClick={() => { if (window.confirm("Supprimer définitivement cette demande ?")) action({ kind: "quote", id: quote.id, action: "delete" }); }}>Supprimer</button></div></article>)}</div> : <p className="admin-empty">Aucune demande pour le moment.</p>}</section>
    <section className="admin-section"><h2>Avis clients <small>({reviews.length})</small></h2>{reviews.length ? <div className="admin-table">{reviews.map((review) => <article className="admin-record" key={review.id}><div><h3>{review.author} · <RatingStars rating={review.rating} size={14} /></h3><small>{new Date(review.createdAt).toLocaleString("fr-FR")} · {review.city || "Commune non indiquée"} · {review.status === "pending" ? "En attente" : review.status === "approved" ? "Publié" : "Refusé"}</small><p>“{review.message}”</p></div>{review.status === "pending" ? <div className="admin-controls"><button disabled={busy === review.id} onClick={() => action({ kind: "review", id: review.id, status: "approved" })}>Accepter</button><button disabled={busy === review.id} onClick={() => action({ kind: "review", id: review.id, status: "rejected" })}>Refuser</button></div> : review.status === "approved" ? <div className="admin-controls"><button disabled={busy === review.id} onClick={() => { if (window.confirm("Supprimer définitivement cet avis ?")) action({ kind: "review", id: review.id, action: "delete" }); }}>Supprimer</button></div> : null}</article>)}</div> : <p className="admin-empty">Aucun avis pour le moment.</p>}</section>
    <section className="admin-section"><h2>Photos du site</h2><div className="admin-photo-grid">{photos.map((photo) => <article className="admin-photo" key={photo.slot}><img src={photo.src} alt={photo.alt} /><h3>{photo.title}</h3><form className="admin-upload" onSubmit={(event) => upload(event, photo.slot)}><input type="hidden" name="slot" value={photo.slot} /><label className="field">Nouvelle image<input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></label><label className="field">Description de l’image<input type="text" name="alt" defaultValue={photo.alt} minLength={10} maxLength={180} required /></label><button disabled={busy === photo.slot}>Remplacer la photo</button></form><button className="reset-photo" disabled={busy === photo.slot} onClick={() => action({ kind: "photo", slot: photo.slot, action: "reset" })}>Revenir à la photo d’origine</button></article>)}</div></section>
  </main>;
}

export function Logout() {
  return <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.reload(); }}>Déconnexion</button>;
}

export default AdminPanel;
