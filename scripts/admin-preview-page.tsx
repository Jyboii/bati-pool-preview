import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publicPath } from "@/lib/public-path";

export const metadata = {
  title: "Administration — démo visuelle | Bâti Pool",
  robots: { index: false, follow: false },
};

const photos = [
  { title: "Piscine et terrasse", src: "/piscine-terrasse.jpg", alt: "Piscine extérieure et terrasse" },
  { title: "Piscine dans le jardin", src: "/piscine-jardin.jpg", alt: "Piscine extérieure dans un jardin" },
  { title: "Piscine intérieure", src: "/piscine-interieure.jpg", alt: "Piscine intérieure" },
] as const;

export default function AdminPreviewPage() {
  return (
    <div className="admin-shell admin-demo">
      <header className="admin-header">
        <Link href="/">BÂTI<span>’POOL</span></Link>
        <nav><Link className="admin-site-link" href="/">Voir le site <ArrowUpRight size={16} aria-hidden="true" /></Link></nav>
      </header>
      <main className="admin-content">
        <div className="admin-demo-notice" role="note">
          <strong>Démo visuelle</strong>
          <span>Données fictives. Les commandes sont désactivées sur cet aperçu.</span>
        </div>
        <span className="eyebrow">ESPACE DE GESTION</span>
        <h1>Tableau de bord</h1>

        <section className="admin-section" aria-labelledby="demo-quotes">
          <h2 id="demo-quotes">Demandes de devis <small>(2 exemples)</small></h2>
          <div className="admin-table">
            <article className="admin-record">
              <div><h3>Client exemple · Construction de piscine</h3><small>Exemple fictif · Valenciennes</small><p>Projet de piscine extérieure avec terrasse. Souhaite échanger sur les dimensions et les finitions.</p><p>Coordonnées masquées dans cette démonstration.</p></div>
              <div className="admin-controls"><select aria-label="Statut de la demande exemple" defaultValue="nouveau" disabled><option value="nouveau">Nouveau</option></select><button disabled>Supprimer</button></div>
            </article>
            <article className="admin-record">
              <div><h3>Client exemple · Maçonnerie</h3><small>Exemple fictif · Lille</small><p>Travaux de dalle béton pour une terrasse. Demande d’estimation après visite.</p><p>Coordonnées masquées dans cette démonstration.</p></div>
              <div className="admin-controls"><select aria-label="Statut de la deuxième demande exemple" defaultValue="contacté" disabled><option value="contacté">Contacté</option></select><button disabled>Supprimer</button></div>
            </article>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="demo-reviews">
          <h2 id="demo-reviews">Avis clients <small>(1 exemple)</small></h2>
          <div className="admin-table">
            <article className="admin-record">
              <div><h3>Client exemple · ★★★★★</h3><small>Exemple fictif · En attente</small><p>« Exemple d’avis affiché pour illustrer la modération. »</p></div>
              <div className="admin-controls"><button disabled>Accepter</button><button disabled>Refuser</button></div>
            </article>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="demo-photos">
          <h2 id="demo-photos">Photos du site</h2>
          <div className="admin-photo-grid">
            {photos.map((photo) => <article className="admin-photo" key={photo.src}>
              <Image src={publicPath(photo.src)} alt={photo.alt} width={400} height={145} />
              <h3>{photo.title}</h3>
              <div className="admin-upload">
                <label className="field">Nouvelle image<input type="file" disabled /></label>
                <label className="field">Description de l’image<input type="text" defaultValue={photo.alt} disabled /></label>
                <button disabled>Remplacer la photo</button>
              </div>
              <button className="reset-photo" disabled>Revenir à la photo d’origine</button>
            </article>)}
          </div>
        </section>
      </main>
    </div>
  );
}
