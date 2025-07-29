import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import illustration404 from "/public/images/404-illustration.png";
import Header from "@/components/header";
import { buttonVariants } from "@/components/ui/button";

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
        className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 xl:pt-20"
        role="main"
        aria-live="polite"
      >
        <Image
          src={illustration404}
          alt=""
          className="mb-4"
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

        <p id="not-found-description" className="mb-4">
          {t("description")}
        </p>

        <Link
          href="/"
          className={buttonVariants({ variant: "default" })}
          aria-describedby="back-to-home-sr-description"
        >
          {t("backToHome")}
        </Link>

        <p id="back-to-home-sr-description" className="sr-only">
          {t("a11y.backToHomeDescription")}
        </p>
      </main>
    </>
  );
}
