import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import localFont from "next/font/local";

import "./globals.css";

const articulatCF = localFont({
  src: [
    {
      path: "../assets/fonts/Articulat_CF/articulatcf-medium-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Articulat_CF/articulatcf-demibold-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Articulat_CF/articulatcf-bold-700.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Articulat_CF/articulatcf-heavy-900.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-articulat-cf",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
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
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${articulatCF.variable} bg-secondary-beige font-sans antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
