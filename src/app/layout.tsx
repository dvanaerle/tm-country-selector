import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

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
  variable: "--font-articulat-cf",
});

const locale = await getLocale();

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      template: t("titleTemplate"),
      default: t("defaultTitle"),
    },
    description: t("description"),
    keywords: t("keywords"),
    icons: {
      icon: "/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={locale}>
      <body
        className={`${articulatCF.variable} bg-secondary-beige font-sans antialiased`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
