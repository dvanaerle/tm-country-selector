import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import "./globals.css";

// Laadt het lokale 'Articulat CF' lettertype en stelt het beschikbaar als een CSS-variabele.
const articulatCF = localFont({
  src: [
    {
      path: "../../public/fonts/Articulat_CF/articulatcf-medium-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Articulat_CF/articulatcf-demibold-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Articulat_CF/articulatcf-bold-700.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Articulat_CF/articulatcf-heavy-900.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-articulat-cf", // CSS-variabele naam voor eenvoudige styling.
  fallback: ["system-ui", "sans-serif"], // Fallback lettertypen voor robuustheid.
  display: "swap", // Zorgt voor snelle weergave van tekst tijdens het laden.
});

/**
 * Genereert de standaard metadata voor de applicatie.
 * Kan per pagina worden overschreven of uitgebreid.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.Home.metaData");

  return {
    title: {
      template: "%s | Tuinmaximaal", // Een template voor paginatitels.
      default: t("title"), // De standaardtitel voor de homepage.
    },
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${articulatCF.variable} bg-orange-10 font-sans antialiased`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
