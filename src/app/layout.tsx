// Importing types and modules needed for metadata, internationalization, and global styles.
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import localFont from "next/font/local";

import "./globals.css"; // Importing global CSS styles.

// Importing the local font with different weights and styles.
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
  variable: "--font-articulat-cf", // Use a unique variable name
});

// Fetching the current locale asynchronously.
const locale = await getLocale();

// Function to generate metadata for the application, such as title and description.
// It uses translations based on the current locale and a specific namespace ("Home").
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Home" });
  return {
    title: t("title", { storeName: t("storeName") }), // Dynamic title using translations.
    description: t("description", { storeName: t("storeName") }), // Dynamic description using translations.
    icons: {
      icon: "./favicon/favicon.png", // Path to the favicon.
    },
  };
}

// Root layout component that wraps the entire application.
// It ensures the correct locale is set and provides internationalization support.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode; // React's type for child components.
}) {
  return (
    <html lang={locale}>
      <body className={`${articulatCF.variable} bg-secondary-beige font-sans`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
