import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import "./globals.css";

const locale = await getLocale();

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Home" });
  return {
    title: t("title", { storeName: t("storeName") }),
    description: t("description", { storeName: t("storeName") }),
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
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/igx1cum.css" />
      </head>
      <body className="bg-secondary-beige">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
