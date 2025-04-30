// Importing types and modules needed for metadata, internationalization, and global styles.
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import "./globals.css"; // Importing global CSS styles.

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
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/igx1cum.css" />
      </head>
      <body className="bg-secondary-beige">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
