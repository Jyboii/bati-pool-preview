import Image from "next/image";
import QuoteForm from "./quote-form";
import ReviewForm from "./review-form";
import { getGalleryItems, getPublishedReviews } from "@/lib/site-data";

export const dynamic = "force-dynamic";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "Bâti Pool",
  description: "Travaux de maçonnerie, carrelage, dalles béton et construction, rénovation et entretien de piscines en béton dans le Nord.",
  email: "carpereira76@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "443 rue Augustin Bay",
    postalCode: "59690",
    addressLocality: "Vieux-Condé",
    addressCountry: "FR",
  },
  areaServed: ["Valenciennes", "Lille", "Lens", "Maubeuge", "Cambrai"],
};

export default async function Home() {
  const [photos, reviews] = await Promise.all([getGalleryItems(), getPublishedReviews()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <header className="site-header">
        <a className="brand" href="#haut" aria-label="Bâti Pool, accueil">
          <Image src="/logo-symbole.jpg" alt="" width={100} height={56} priority className="brand-symbol" />
          <span className="brand-name">BÂTI<span>’POOL</span><small>BÂTIMENT & PISCINES</small></span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#services">Nos savoir-faire</a>
          <a href="#realisations">Réalisations</a>
          <a href="#avis">Avis clients</a>
        </nav>
        <a className="header-cta" href="#devis">Votre projet <span aria-hidden="true">↗</span></a>
      </header>

      <main id="haut">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image">
            <Image src={photos[0].src} alt={photos[0].alt} fill priority sizes="(max-width: 900px) 100vw, 58vw" className="hero-photo" />
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="eyebrow light">BÂTIMENT GÉNÉRAL <span>·</span> PISCINES EN BÉTON</p>
              <h1 id="hero-title">Vos projets de <em>bâtiment</em> et de <em>piscine</em>, entre de bonnes mains.</h1>
              <p className="hero-intro">Maçonnerie, carrelage, dalles béton, construction et rénovation de piscines : Bâti Pool intervient à Vieux-Condé et dans les Hauts-de-France.</p>
              <div className="hero-pills"><span>Travaux de bâtiment</span><span>Piscines & entretien</span></div>
            </div>
            <p className="hero-caption">RÉALISATION BÂTI POOL <span>01 / 03</span></p>
          </div>
          <div className="hero-form-panel" id="devis">
            <div className="form-head">
              <span className="eyebrow">UN PROJET EN TÊTE ?</span>
              <h2>Parlons de votre projet.</h2>
              <p>Quelques informations suffisent pour que nous puissions vous recontacter et préparer votre devis.</p>
            </div>
            <QuoteForm />
          </div>
        </section>

        <div className="local-strip">
          <span>Basés à Vieux-Condé</span>
          <span className="strip-line" aria-hidden="true" />
          <span>À vos côtés dans le Nord et les environs</span>
          <a href="#secteur">Voir notre secteur <span aria-hidden="true">↗</span></a>
        </div>

        <section className="section services" id="services">
          <div className="section-heading">
            <div><span className="eyebrow">NOS SAVOIR-FAIRE</span><h2>Deux métiers.<br /><em>Une même exigence.</em></h2></div>
            <p>Du gros œuvre aux finitions, du bassin en béton à son entretien, nous accompagnons vos projets avec une approche concrète et soignée.</p>
          </div>
          <div className="service-grid">
            <article className="service-card building-card">
              <div className="service-card-top"><span>01 / BÂTIMENT</span><span aria-hidden="true">↗</span></div>
              <div className="building-art" aria-hidden="true"><span /><span /><span /></div>
              <div className="service-card-body"><h3>Construire, rénover,<br />poser les bases.</h3><p>Des travaux de bâtiment pour créer ou transformer vos espaces, du support jusqu’aux revêtements.</p><ul><li>Maçonnerie</li><li>Pose de carrelage</li><li>Dalles béton</li></ul></div>
            </article>
            <article className="service-card pool-card">
              <div className="service-card-top"><span>02 / PISCINES</span><span aria-hidden="true">↗</span></div>
              <div className="service-card-body"><h3>Un bassin pensé<br />pour votre quotidien.</h3><p>Un savoir-faire dédié aux piscines en béton, de la création aux interventions sur l’existant.</p><ul><li>Construction</li><li>Rénovation</li><li>Entretien</li></ul></div>
              <Image src={photos[1].src} alt={photos[1].alt} width={900} height={620} sizes="(max-width: 700px) 100vw, 45vw" className="service-pool-image" />
            </article>
          </div>
        </section>

        <section className="section gallery-section" id="realisations">
          <div className="section-heading gallery-heading"><div><span className="eyebrow">SUR LE TERRAIN</span><h2>Des réalisations<br /><em>qui parlent d’elles-mêmes.</em></h2></div><p>Découvrez quelques projets de piscines réalisés par Bâti Pool. Chaque chantier a son cadre, ses contraintes et son caractère.</p></div>
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <figure className={`gallery-item gallery-item-${index + 1}`} key={photo.slot}>
                <Image src={photo.src} alt={photo.alt} fill sizes={index === 0 ? "(max-width: 700px) 100vw, 56vw" : "(max-width: 700px) 100vw, 38vw"} />
                <figcaption><span>0{index + 1} / {photo.label}</span><strong>{photo.title}</strong></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section approach-section">
          <span className="eyebrow">VOTRE DEMANDE, SIMPLEMENT</span>
          <div className="approach-title"><h2>Une première étape<br /><em>sans complication.</em></h2><a className="text-link" href="#devis">Demander un devis <span aria-hidden="true">↗</span></a></div>
          <div className="step-grid"><div><b>01</b><h3>Décrivez votre projet</h3><p>Indiquez le type de travaux, la commune et ce que vous souhaitez réaliser.</p></div><div><b>02</b><h3>Nous vous recontactons</h3><p>Nous prenons connaissance de votre demande et échangeons sur vos besoins.</p></div><div><b>03</b><h3>Avançons ensemble</h3><p>Nous précisons les travaux à envisager et les prochaines étapes du devis.</p></div></div>
        </section>

        <section className="section reviews-section" id="avis">
          <div className="section-heading"><div><span className="eyebrow">LA PAROLE À NOS CLIENTS</span><h2>Leur expérience,<br /><em>en toute transparence.</em></h2></div><p>Les retours de nos clients aident les prochains à se projeter. Chaque avis affiché ici est publié après vérification.</p></div>
          {reviews.length ? <div className="review-grid">{reviews.map((review) => <blockquote key={review.id} className="review-card"><span className="review-stars" aria-label={`${review.rating} étoiles sur 5`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span><p>“{review.message}”</p><footer>{review.author}{review.city ? ` · ${review.city}` : ""}</footer></blockquote>)}</div> : <div className="review-empty"><span aria-hidden="true">✳</span><p>Les premiers avis seront bientôt visibles ici.</p></div>}
          <ReviewForm />
        </section>

        <section className="section area-section" id="secteur">
          <div><span className="eyebrow light">ANCRÉS DANS LE NORD</span><h2>Vieux-Condé<br />et <em>bien au-delà.</em></h2><p>Pour vos travaux de bâtiment ou votre projet de piscine, Bâti Pool intervient notamment autour de ces villes.</p></div>
          <div className="city-list"><span>Valenciennes <b>↗</b></span><span>Lille <b>↗</b></span><span>Lens <b>↗</b></span><span>Maubeuge <b>↗</b></span><span>Cambrai <b>↗</b></span></div>
        </section>
      </main>

      <footer className="footer"><div className="footer-main"><div><Image src="/logo-bati-pool.jpg" alt="Logo Bâti Pool" width={210} height={210} className="footer-logo" /><p>Bâtiment général & construction de piscines</p></div><div><span className="eyebrow">NOUS CONTACTER</span><a href="mailto:carpereira76@gmail.com">carpereira76@gmail.com</a><p>443 rue Augustin Bay<br />59690 Vieux-Condé</p></div><div><span className="eyebrow">UN PROJET ?</span><h3>Faisons-le<br />prendre forme.</h3><a href="#devis">Demander un devis <span aria-hidden="true">↗</span></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bâti Pool · SIRET 81204991600023</span><div><a href="/confidentialite">Confidentialité</a><a href="/admin">Administration</a></div></div></footer>
    </>
  );
}
