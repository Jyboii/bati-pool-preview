import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "cloudflare:workers";
import LandingPage from "../landing";
import { cities, getCity } from "@/lib/cities";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return cities.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};

  const title = `Piscine à ${city.name} | Construction, rénovation et entretien | Bâti Pool`;
  const description = `Piscine en béton à ${city.name} : construction, rénovation et entretien avec Bâti Pool. Maçonnerie, carrelage et dalle béton pour votre projet. Demandez un devis.`;
  const canonical = env.SITE_PUBLIC_URL ? `${env.SITE_PUBLIC_URL.replace(/\/$/, "")}/${city.slug}` : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title, description, url: canonical, locale: "fr_FR", type: "website" },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  return <LandingPage city={city} />;
}
