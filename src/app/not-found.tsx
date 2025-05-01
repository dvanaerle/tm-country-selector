import type { Metadata } from "next";
import Header from "@/components/header";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import illustration404 from "@/assets/images/404/404-illustration.png";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");

  return {
    title: t("title"),
  };
}

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <>
      <Header />
      <div className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] flex-col items-center justify-center px-4 py-12 text-center xl:p-20">
        <Image src={illustration404} alt={t("imageAlt")} priority />
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
