import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import QuoteForm from "./quote-form";
import ReviewForm from "./review-form";
import RatingStars from "./rating-stars";
import StepIllustration from "./step-illustration";
import ProjectGallery from "./project-gallery";
import MotionEffects from "./motion-effects";
import MobileNavigation from "./mobile-navigation";
import { getGalleryItems, getPublishedReviews, getPublishedReviewStats } from "@/lib/site-data";
import { cities, type City, type CityFocus } from "@/lib/cities";

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

export default async function LandingPage({ city, focus = "pool" }: { city?: City; focus?: CityFocus }) {
  const [photos, reviews, reviewStats] = await Promise.all([getGalleryItems(), getPublishedReviews(), getPublishedReviewStats()]);
  const isBuildingPage = Boolean(city && focus === "building");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(city ? { ...localBusiness, areaServed: city.name } : localBusiness) }} />
      <MotionEffects key={city ? `${focus}-${city.slug}` : "home"} />
      <main id="haut">
        <section className="hero hero-refit" aria-labelledby="hero-title">
          <div className="hero-left">
            <header className="site-header">
              <Link className="brand hero-brand" href="/" aria-label="Bâti Pool, accueil">
                <span className="brand-name">BÂTI{" "}<span>POOL</span><small>BÂTIMENT & PISCINES</small></span>
              </Link>
              <MobileNavigation />
            </header>
            <nav className="hero-navigation" aria-label="Navigation principale">
              <a href="#services">Savoir-faire</a>
              <a href="#realisations">Réalisations</a>
              <a href="#avis">Avis</a>
              <a className="hero-navigation-contact" href="#devis">Contact</a>
            </nav>
            <div className="hero-copy">
              <p className="hero-availability"><span className="hero-availability-dot" aria-hidden="true" /><span className="hero-availability-text">{isBuildingPage ? `PROJETS DE BÂTIMENT À ${city!.name.toUpperCase()}` : city ? `PROJETS DE PISCINE À ${city.name.toUpperCase()}` : "BÂTIMENT & PISCINES DANS LE NORD"}</span></p>
              <h1 id="hero-title">{isBuildingPage ? <>Vos travaux de <em className="hero-word-building">maçonnerie</em> à {city!.name}, entre de bonnes mains.</> : city ? <>Votre projet de <em className="hero-word-pool">piscine</em> à {city.name}, entre de bonnes mains.</> : <>Vos projets de <em className="hero-word-building">bâtiment</em> et de <em className="hero-word-pool">piscine</em>, entre de bonnes mains.</>}</h1>
              <p className="hero-intro">{isBuildingPage ? city!.buildingLead : city?.lead ?? "Maçonnerie, carrelage, dalles béton, construction et rénovation de piscines : Bâti Pool intervient à Vieux-Condé et dans les Hauts-de-France."}</p>
              <a className="hero-primary-cta" href="#devis"><span>Parlons de votre projet</span><span className="hero-primary-icon" aria-hidden="true"><ArrowUpRight size={19} /></span></a>
              {reviewStats.count > 0 && <div className="hero-trust"><a className="hero-reviews" href="#avis"><RatingStars rating={Math.round(reviewStats.averageRating)} size={15} /><span>{reviewStats.count} {reviewStats.count === 1 ? "client satisfait" : "clients satisfaits"}</span></a></div>}
            </div>
          </div>
          <div className="hero-image">
            <Image src={photos[0].src} alt={photos[0].alt} fill priority sizes="(max-width: 900px) 100vw, 58vw" className="hero-photo" />
            <div className="hero-shade" />
            <div className="hero-photo-footer">
              <div className="hero-photo-experience" aria-label="Plus de 10 ans d’expérience">
                <strong>10<span>+</span></strong>
                <span>ANNÉES D’EXPÉRIENCE</span>
              </div>
              <a className="hero-project-card" href="#realisations">
                <span className="hero-project-kicker">RÉALISATION BÂTI POOL</span>
                <strong>{photos[0].title}</strong>
                <span className="hero-project-link">Voir nos projets <ArrowUpRight size={16} aria-hidden="true" /></span>
              </a>
            </div>
          </div>
        </section>

        <section className="hero-form-panel hero-quote-section" id="devis" aria-labelledby="quote-title">
          <div className="form-head">
            <span className="eyebrow">VOTRE PROJET COMMENCE ICI</span>
            <h2 id="quote-title">{city ? `Parlons de votre projet à ${city.name}.` : "Parlons de votre projet."}</h2>
            <p>Quelques informations suffisent pour que nous puissions vous recontacter et préparer votre devis.</p>
          </div>
          <QuoteForm idPrefix="hero" defaultCity={city?.name} />
        </section>

        <section className="section services" id="services">
          <div className="section-heading" data-reveal>
            <div><span className="eyebrow">NOS SAVOIR-FAIRE</span><h2>Deux métiers.<br /><em>Une même exigence.</em></h2></div>
            <p>{isBuildingPage ? `Maçonnerie, carrelage et dalle béton à ${city!.name} : nous étudions vos travaux, du support aux finitions.` : city ? `Piscine et travaux de bâtiment à ${city.name} : nous étudions votre projet, du support aux finitions.` : "Du gros œuvre aux finitions, du bassin à son entretien, nous accompagnons vos projets avec une approche concrète et soignée."}</p>
          </div>
          <div className="service-grid">
            <article className="service-card building-card" data-reveal>
              <div className="service-card-top"><span>01 / BÂTIMENT</span><span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></div>
              <div className="building-art" aria-hidden="true"><span /><span /><span /></div>
              <div className="service-card-body"><h3>Construire, rénover,<br />poser les bases.</h3><p>{isBuildingPage ? "Maçonnerie, pose de carrelage et dalle béton : nous étudions votre besoin, les supports et les finitions." : city?.building ?? "Des travaux de bâtiment pour créer ou transformer vos espaces, du support jusqu’aux revêtements."}</p><ul><li>Maçonnerie</li><li>Pose de carrelage</li><li>Dalles béton</li></ul></div>
            </article>
            <article className="service-card pool-card reveal-delay-1" data-reveal>
              <div className="service-card-top"><span>02 / PISCINES</span><span className="action-icon" aria-hidden="true"><ArrowUpRight size={20} /></span></div>
              <div className="service-card-body"><h3>Un bassin pensé<br />pour votre quotidien.</h3><p>{isBuildingPage ? "Bâti Pool vous accompagne aussi pour la construction, la rénovation et l’entretien de piscines." : city?.pool ?? "Un savoir-faire dédié aux piscines, de la création aux interventions sur l’existant."}</p><ul><li>Construction</li><li>Rénovation</li><li>Entretien</li></ul></div>
              <Image src={photos[1].src} alt={photos[1].alt} width={900} height={620} sizes="(max-width: 700px) 100vw, 45vw" className="service-pool-image" />
            </article>
          </div>
        </section>

        {city && <section className="section city-project-section" aria-labelledby="city-project-title">
          <div className="city-project-inner">
            <div data-reveal><span className="eyebrow">VOTRE PROJET LOCAL</span><h2 id="city-project-title">{isBuildingPage ? <>Des travaux de bâtiment à <em>{city.name}</em> pensés pour votre espace.</> : <>Une piscine à <em>{city.name}</em> qui correspond à votre projet.</>}</h2></div>
            <div className="reveal-delay-1" data-reveal><p>{isBuildingPage ? city.buildingProject : city.project}</p><a className="hero-primary-cta" href="#devis"><span>Parler de mon projet</span><span className="hero-primary-icon" aria-hidden="true"><ArrowUpRight size={19} /></span></a></div>
          </div>
        </section>}

        <section className="section gallery-section" id="realisations">
          <div className="section-heading gallery-heading" data-reveal><div><span className="eyebrow">SUR LE TERRAIN</span><h2>{isBuildingPage ? <>Notre autre métier :<br /><em>les piscines.</em></> : <>Des réalisations<br /><em>qui parlent d’elles-mêmes.</em></>}</h2></div><p>{isBuildingPage ? "Découvrez également quelques projets de piscines réalisés par Bâti Pool." : "Découvrez quelques projets de piscines réalisés par Bâti Pool. Chaque chantier a son cadre, ses contraintes et son caractère."}</p></div>
          <ProjectGallery photos={photos} />
        </section>

        <section className="section approach-section" id="etapes">
          <div className="approach-title" data-reveal><h2>Comment ça<br /><em>marche</em></h2></div>
          <div className="step-grid"><div data-reveal><b>01</b><h3>Présentez votre projet</h3><p>Indiquez le type de travaux et votre commune, puis laissez vos coordonnées.</p><StepIllustration step={1} /></div><div className="reveal-delay-1" data-reveal><b>02</b><h3>Nous vous recontactons</h3><p>Nous prenons connaissance de votre demande et échangeons sur vos besoins.</p><StepIllustration step={2} /></div><div className="reveal-delay-2" data-reveal><b>03</b><h3>Avançons ensemble</h3><p>Nous précisons les travaux à envisager et les prochaines étapes du devis.</p><StepIllustration step={3} /></div></div>
        </section>

        <section className="section closing-contact" id="contact" aria-labelledby="closing-contact-title">
          <div className="closing-contact-inner">
            <div className="closing-contact-copy" data-reveal>
              <span className="closing-contact-kicker">CONTACT</span>
              <h2 id="closing-contact-title">Prenez contact<span>.</span></h2>
              <p>{city ? `Un projet de maçonnerie, de carrelage ou de piscine à ${city.name} ? Décrivez-nous votre besoin et échangeons sur la suite.` : "Un projet de maçonnerie, de carrelage ou de piscine ? Décrivez-nous votre besoin et échangeons sur la suite."}</p>
              <dl className="closing-contact-details">
                <div><dt>ADRESSE</dt><dd>443 rue Augustin Bay<br />59690 Vieux-Condé</dd></div>
                <div><dt>EMAIL</dt><dd><a href="mailto:carpereira76@gmail.com">carpereira76@gmail.com</a></dd></div>
              </dl>
            </div>
            <div className="closing-contact-form reveal-delay-1" data-reveal><QuoteForm idPrefix="closing" defaultCity={city?.name} /></div>
          </div>
        </section>

        <section className="section reviews-section" id="avis">
          <div className="section-heading" data-reveal><div><span className="eyebrow">LA PAROLE DE NOS CLIENTS</span><h2>Leur expérience,<br /><em>en toute transparence.</em></h2></div></div>
          {reviews.length ? <div className="review-grid">{reviews.map((review, index) => <blockquote key={review.id} className={`review-card reveal-delay-${index % 3}`} data-reveal><RatingStars rating={review.rating} /><p>“{review.message}”</p><footer>{review.author}{review.city ? ` · ${review.city}` : ""}</footer></blockquote>)}</div> : <div className="review-empty" data-reveal><p>Les premiers avis seront bientôt visibles ici.</p></div>}
          <div data-reveal><ReviewForm /></div>
        </section>

        <section className="section area-section" id="secteur">
          <div data-reveal><span className="eyebrow light">ANCRÉS DANS LE NORD</span><h2>{city ? <>{city.name}<br />et <em>les environs.</em></> : <>Vieux-Condé<br />et <em>bien au-delà.</em></>}</h2><p>Pour vos travaux de bâtiment ou votre projet de piscine, Bâti Pool intervient notamment autour de ces villes.</p></div>
          <div className="area-links reveal-delay-1" data-reveal><div><h3>Piscines par ville</h3><div className="city-list">{cities.map((item) => <a href={`/${item.slug}`} key={item.slug} aria-current={city?.slug === item.slug && !isBuildingPage ? "page" : undefined}>{item.name} <b className="action-icon" aria-hidden="true"><ArrowUpRight size={18} /></b></a>)}</div></div><div><h3>Bâtiment par ville</h3><div className="city-list">{cities.map((item) => <a href={`/${item.buildingSlug}`} key={item.buildingSlug} aria-current={city?.buildingSlug === item.buildingSlug && isBuildingPage ? "page" : undefined}>{item.name} <b className="action-icon" aria-hidden="true"><ArrowUpRight size={18} /></b></a>)}</div></div></div>
        </section>

      </main>

      <footer className="footer"><div className="footer-main"><div data-reveal><Image src="/logo-bati-pool.jpg" alt="Logo Bâti Pool" width={210} height={210} className="footer-logo" /><p>Bâtiment général & construction de piscines</p></div><div className="reveal-delay-1" data-reveal><span className="eyebrow">NOUS CONTACTER</span><a href="mailto:carpereira76@gmail.com">carpereira76@gmail.com</a><p>443 rue Augustin Bay<br />59690 Vieux-Condé</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bâti Pool · SIRET 81204991600023</span><div><Link href="/confidentialite">Confidentialité</Link><Link href="/admin">Administration</Link></div></div></footer>
    </>
  );
}
