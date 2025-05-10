import type { Metadata } from "next";
import Header from "@/components/header";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import illustration404 from "/public/images/404-illustration.png";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.NotFound.Metadata");

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
      <div className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 xl:p-20">
        <Image
          src={illustration404}
          alt={t("a11y.imageAlt")}
          priority
          fetchPriority="high"
          placeholder="blur"
          sizes="
                 (min-width: 1536px) calc((1536px - 160px),
                 (min-width: 1280px) calc((1280px - 160px),
                 (min-width: 1024px) calc(1024px - 48px),
                 (min-width: 768px) calc(768px - 48px),
                 (min-width: 640px) calc(640px - 48px),
                 calc(100vw - 32px)"
        />
        <h1 className="mb-2">{t("heading")}</h1>
        <p className="text-neutral-grey mb-4">{t("description")}</p>
        <Link
          href="/"
          className={buttonVariants({
            variant: "default",
          })}
        >
          {t("backToHome")}
        </Link>
      </div>
    </>
  );
}
