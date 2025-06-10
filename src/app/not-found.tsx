import type { Metadata } from "next";
import Header from "@/components/header";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import illustration404 from "/public/images/404-illustration.png";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.NotFound.metaData");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function NotFound() {
  const t = useTranslations("Pages.NotFound");

  return (
    <>
      <Header />
      <main
        className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] flex-col items-center justify-center gap-y-4 px-4 py-12 text-center sm:px-6 xl:py-20"
        role="main"
        aria-live="polite" // Maakt de content direct beschikbaar voor screenreaders.
      >
        <Image
          src={illustration404}
          alt={t("a11y.imageAlt")}
          priority
          fetchPriority="high"
          placeholder="blur"
          width={1024}
          height={443}
          sizes="
            (min-width: 1024px) calc(1024px - 48px),
            (min-width: 768px) calc(768px - 48px),
            (min-width: 640px) calc(640px - 48px),
            calc(100vw - 32px)"
        />

        <h1>{t("heading")}</h1>

        <p id="not-found-description" className="text-neutral-grey">
          {t("description")}
        </p>

        {/* Link terug naar de homepage met een toegankelijke beschrijving. */}
        <Link
          href="/"
          className={buttonVariants({ variant: "default" })}
          aria-describedby="back-to-home-sr-description"
        >
          {t("backToHome")}
        </Link>

        {/* Verborgen beschrijving voor screenreaders. */}
        <p id="back-to-home-sr-description" className="sr-only">
          {t("a11y.backToHomeDescription")}
        </p>
      </main>
    </>
  );
}
