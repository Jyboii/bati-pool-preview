import type { Metadata } from "next";
import "./globals.css";

export function generateMetadata(): Metadata {
  const publicUrl = process.env.SITE_PUBLIC_URL;
  return {
    title: "Bâti Pool | Maçonnerie, carrelage et piscines dans le Nord",
    description: "Bâti Pool réalise vos travaux de maçonnerie, carrelage et dalles béton, ainsi que la construction, la rénovation et l'entretien de piscines autour de Valenciennes, Lille, Lens, Maubeuge et Cambrai. Demandez un devis.",
    metadataBase: publicUrl ? new URL(publicUrl) : undefined,
    alternates: publicUrl ? { canonical: publicUrl } : undefined,
    robots: publicUrl ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      title: "Bâti Pool | Bâtiment & piscines",
      description: "Maçonnerie, carrelage, dalles béton et piscines dans le Nord.",
      images: [{ url: "/piscine-terrasse.jpg", width: 1598, height: 719, alt: "Piscine extérieure réalisée par Bâti Pool" }],
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
