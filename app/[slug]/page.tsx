import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "../landing";
import { cities, getCityPage } from "@/lib/cities";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return cities.flatMap(({ slug, buildingSlug }) => [{ slug }, { slug: buildingSlug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getCityPage(slug);
  if (!page) return {};
  const { city, focus } = page;

  const title = focus === "building"
    ? `Maçonnerie à ${city.name} | Carrelage et dalle béton | Bâti Pool`
    : `Piscine à ${city.name} | Construction, rénovation et entretien | Bâti Pool`;
  const description = focus === "building"
    ? `Travaux de maçonnerie à ${city.name}, pose de carrelage et réalisation de dalles béton avec Bâti Pool. Présentez votre projet et demandez un devis.`
    : `Piscine à ${city.name} : construction, rénovation et entretien avec Bâti Pool. Maçonnerie, carrelage et dalle béton pour votre projet. Demandez un devis.`;
  const canonical = process.env.SITE_PUBLIC_URL ? `${process.env.SITE_PUBLIC_URL.replace(/\/$/, "")}/${slug}` : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title, description, url: canonical, locale: "fr_FR", type: "website" },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getCityPage(slug);
  if (!page) notFound();
  return <LandingPage city={page.city} focus={page.focus} />;
}
