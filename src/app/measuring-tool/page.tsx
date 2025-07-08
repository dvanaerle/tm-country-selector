import type { Metadata } from "next";
import Header from "@/components/header";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ClientSection } from "@/components/measuring-tool/ClientSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.MeasuringTool.metaData");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function MeasuringTool() {
  const t = useTranslations("Pages.MeasuringTool");

  return (
    <>
      <Header />
      <main
        className="container mx-auto min-h-[calc(100dvh-(--spacing(19)))] px-4 py-12 sm:px-6 xl:pt-20"
        role="main"
      >
        <ClientSection
          measuringHeightPavingAlt={t("a11y.measuringHeightPavingAlt")}
          measuringWallProfileHeightAlt={t("a11y.measuringWallProfileHeightAlt")}
          tabsHeightBottomGutter={t("tabs.wallProfileHeight")}
          tabsWallProfileHeight={t("tabs.passageHeight")}

          heading={t.rich("heading", {
            sup: (chunks) => <sup>{chunks}</sup>,
          })}
          description={t.rich("description", {
            sup: (chunks) => <sup>{chunks}</sup>,
          })}
        />
      </main>
    </>
  );
}
