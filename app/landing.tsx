import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import QuoteForm from "./quote-form";
import ReviewForm from "./review-form";
import RatingStars from "./rating-stars";
import StepIllustration from "./step-illustration";
import ProjectGallery from "./project-gallery";
import { getGalleryItems, getPublishedReviews } from "@/lib/site-data";
import { cities, type City } from "@/lib/cities";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "Bâti Pool",
  description: "Travaux de maçonnerie, carrelage, dalles béton et construction, rénovation et entretien de piscines dans le Nord.",
  email: "carpereira76@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "443 rue Augustin Bay",
    postalCode: "59690",
    addressLocality: "Vieux-Condé",
    addressCountry: "FR",
  },
  areaServed: cities.map((city) => city.name),
};

export default async function LandingPage({ city }: { city?: City }) {
  const [photos, reviews] = await Promise.all([getGalleryItems(), getPublishedReviews()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(city ? { ...localBusiness, areaServed: city.name } : localBusiness) }} />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Bâti Pool, accueil">
          <Image src="/logo-symbole.jpg" alt="" width={100} height={56} priority className="brand-symbol" />
          <span className="brand-name">BÂTI<span>’POOL</span><small>BÂTIMENT & PISCINES</small></span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#services">Nos savoir-faire</a>
          <a href="#realisations">Réalisations</a>
          <a href="#avis">Avis clients</a>
        </nav>
        <a className="header-cta" href="#devis">Demander mon devis <span className="action-icon" aria-hidden="true"><ArrowUpRight size={18} /></span></a>
      </header>

      <main id="haut">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image">
            <Image src={photos[0].src} alt={photos[0].alt} fill priority sizes="(max-width: 900px) 100vw, 58vw" className="hero-photo" />
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="eyebrow light">BÂTIMENT GÉNÉRAL <span>·</span> PISCINES{city ? ` À ${city.name.toUpperCase()}` : ""}</p>
              <h1 id="hero-title">{city ? <>Votre projet de <em className="hero-word-pool">piscine</em> à {city.name}, entre de bonnes mains.</> : <>Vos projets de <em className="hero-word-building">bâtiment</em> et de <em className="hero-word-pool">piscine</em>, entre de bonnes mains.</>}</h1>
              <p className="hero-intro">{city?.lead ?? "Maçonnerie, carrelage, dalles béton, construction et rénovation de piscines : Bâti Pool intervient à Vieux-Condé et dans les Hauts-de-France."}</p>
              <div className="hero-pills"><span>Travaux de bâtiment</span><span>Piscines & entretien</span></div>
            </div>
          </div>
          <div className="hero-form-panel" id="devis">
            <div className="form-head">
              <h2>{city ? `Parlons de votre projet à ${city.name}.` : "Parlons de votre projet."}</h2>
              <p>Quelques informations suffisent pour que nous puissions vous recontacter et préparer votre devis.</p>
            </div>
            <QuoteForm idPrefix="hero" defaultCity={city?.name} />
          </div>
        </section>

        <section className="section services" id="services">
          <div className="section-heading">
            <div><span className="eyebrow">NOS SAVOIR-FAIRE</span><h2>Deux métiers.<br /><em>Une même exigence.</em></h2></div>
            <p>{city ? `Piscine et travaux de bâtiment à ${city.name} : nous étudions votre projet, du support aux finitions.` : "Du gros œuvre aux finitions, du bassin à son entretien, nous accompagnons vos projets avec une approche concrète et soignée."}</p>
          </div>
          <div className="service-grid">
            <article className="service-card building-card">
              <div className="service-card-top"><span>01 / BÂTIMENT</span><span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></div>
              <div className="building-art" aria-hidden="true"><span /><span /><span /></div>
              <div className="service-card-body"><h3>Construire, rénover,<br />poser les bases.</h3><p>{city?.building ?? "Des travaux de bâtiment pour créer ou transformer vos espaces, du support jusqu’aux revêtements."}</p><ul><li>Maçonnerie</li><li>Pose de carrelage</li><li>Dalles béton</li></ul></div>
            </article>
            <article className="service-card pool-card">
              <div className="service-card-top"><span>02 / PISCINES</span><span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></div>
              <div className="service-card-body"><h3>Un bassin pensé<br />pour votre quotidien.</h3><p>{city?.pool ?? "Un savoir-faire dédié aux piscines, de la création aux interventions sur l’existant."}</p><ul><li>Construction</li><li>Rénovation</li><li>Entretien</li></ul></div>
              <Image src={photos[1].src} alt={photos[1].alt} width={900} height={620} sizes="(max-width: 700px) 100vw, 45vw" className="service-pool-image" />
            </article>
          </div>
        </section>

        {city && <section className="section city-project-section" aria-labelledby="city-project-title">
          <div className="city-project-inner">
            <div><span className="eyebrow">VOTRE PROJET LOCAL</span><h2 id="city-project-title">Une piscine à <em>{city.name}</em> qui correspond à votre projet.</h2></div>
            <div><p>{city.project}</p><a className="text-link" href="#devis">Parler de mon projet <span className="action-icon" aria-hidden="true"><ArrowUpRight size={18} /></span></a></div>
          </div>
        </section>}

        <section className="section gallery-section" id="realisations">
          <div className="section-heading gallery-heading"><div><span className="eyebrow">SUR LE TERRAIN</span><h2>Des réalisations<br /><em>qui parlent d’elles-mêmes.</em></h2></div><p>Découvrez quelques projets de piscines réalisés par Bâti Pool. Chaque chantier a son cadre, ses contraintes et son caractère.</p></div>
          <ProjectGallery photos={photos} />
        </section>

        <section className="section approach-section" id="etapes">
          <span className="eyebrow">VOTRE DEMANDE, SIMPLEMENT</span>
          <div className="approach-title"><h2>Une première étape<br /><em>sans complication.</em></h2><a className="text-link" href="#devis">Demander un devis <span className="action-icon" aria-hidden="true"><ArrowUpRight size={18} /></span></a></div>
          <div className="step-grid"><div><b>01</b><h3>Décrivez votre projet</h3><p>Indiquez le type de travaux, la commune et ce que vous souhaitez réaliser.</p><StepIllustration step={1} /></div><div><b>02</b><h3>Nous vous recontactons</h3><p>Nous prenons connaissance de votre demande et échangeons sur vos besoins.</p><StepIllustration step={2} /></div><div><b>03</b><h3>Avançons ensemble</h3><p>Nous précisons les travaux à envisager et les prochaines étapes du devis.</p><StepIllustration step={3} /></div></div>
        </section>

        <section className="section reviews-section" id="avis">
          <div className="section-heading"><div><span className="eyebrow">LA PAROLE À NOS CLIENTS</span><h2>Leur expérience,<br /><em>en toute transparence.</em></h2></div><p>Chaque avis affiché ici est publié après vérification.</p></div>
          {reviews.length ? <div className="review-grid">{reviews.map((review) => <blockquote key={review.id} className="review-card"><RatingStars rating={review.rating} /><p>“{review.message}”</p><footer>{review.author}{review.city ? ` · ${review.city}` : ""}</footer></blockquote>)}</div> : <div className="review-empty"><span className="action-icon" aria-hidden="true"><Sparkles size={28} /></span><p>Les premiers avis seront bientôt visibles ici.</p></div>}
          <ReviewForm />
        </section>

        <section className="section area-section" id="secteur">
          <div><span className="eyebrow light">ANCRÉS DANS LE NORD</span><h2>{city ? <>{city.name}<br />et <em>les environs.</em></> : <>Vieux-Condé<br />et <em>bien au-delà.</em></>}</h2><p>Pour vos travaux de bâtiment ou votre projet de piscine, Bâti Pool intervient notamment autour de ces villes.</p></div>
          <div className="city-list">{cities.map((item) => <a href={`/${item.slug}`} key={item.slug} aria-current={city?.slug === item.slug ? "page" : undefined}>{item.name} <b className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></b></a>)}</div>
        </section>

        <section className="section closing-contact" aria-labelledby="closing-contact-title">
          <div className="closing-contact-inner">
            <div className="closing-contact-copy">
              <h2 id="closing-contact-title">Parlons de ce que<br /><em>vous imaginez.</em></h2>
              <p>{city ? `Maçonnerie, carrelage, dalle béton ou piscine à ${city.name} : décrivez-nous votre projet et laissez-nous un moyen de vous recontacter.` : "Maçonnerie, carrelage, dalle béton ou piscine : décrivez-nous votre projet et laissez-nous un moyen de vous recontacter."}</p>
            </div>
            <div className="closing-contact-form"><QuoteForm idPrefix="closing" defaultCity={city?.name} /></div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="footer-main"><div><Image src="/logo-bati-pool.jpg" alt="Logo Bâti Pool" width={210} height={210} className="footer-logo" /><p>Bâtiment général & construction de piscines</p></div><div><span className="eyebrow">NOUS CONTACTER</span><a href="mailto:carpereira76@gmail.com">carpereira76@gmail.com</a><p>443 rue Augustin Bay<br />59690 Vieux-Condé</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bâti Pool · SIRET 81204991600023</span><div><a href="/confidentialite">Confidentialité</a><a href="/admin">Administration</a></div></div></footer>
    </>
  );
}
