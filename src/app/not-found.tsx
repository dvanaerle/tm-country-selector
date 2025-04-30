// Importing necessary types and components from Next.js and the application
import type { Metadata } from "next";
import Header from "@/components/header";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

// Function to generate metadata for the page, such as the title
export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}): Promise<Metadata> {
  // Determine the locale (language) to use, either from the URL or default
  const locale = params?.locale || (await getLocale());

  // Fetch translations for the "NotFound" and "Home" namespaces
  const t = await getTranslations({ locale, namespace: "NotFound" });
  const tHome = await getTranslations({ locale, namespace: "Home" });

  // Return the page title using translations
  return {
    title: t("title", { storeName: tHome("storeName") }),
  };
}

// React component for the "Not Found" page
export default function NotFound() {
  // Hook to access translations for the "NotFound" namespace
  const t = useTranslations("NotFound");

  return (
    <>
      {/* Render the header component */}
      <Header />
      <div className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] flex-col items-center justify-center px-4 py-12 text-center xl:p-20">
        {/* Display an illustration for the 404 page */}
        <Image
          src={"/404/404-illustration.png"}
          alt={t("imageAlt")} // Alt text for accessibility, fetched from translations
          width={1536}
          height={665}
          priority
        />
        {/* Heading and description text, both translated */}
        <h1 className="mb-2">{t("heading")}</h1>
        <p className="text-neutral-grey mb-4">{t("description")}</p>
        {/* Link to navigate back to the home page */}
        <Link
          href="/"
          className={buttonVariants({
            variant: "default", // Styling for the button
          })}
        >
          {t("backToHome")} {/* Button text, translated */}
        </Link>
      </div>
    </>
  );
}
