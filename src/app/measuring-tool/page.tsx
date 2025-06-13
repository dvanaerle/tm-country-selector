import type { Metadata } from "next";
import Header from "@/components/header";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeasuringVideoThumb from "/public/images/measuring-video-thumb.jpg";
import { PassageHeightCalculatorForm } from "@/components/measuring-tool/PassageHeightCalculatorForm";
import Video from "@/components/ui/video";

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
        className="container mx-auto min-h-[calc(100dvh-(--spacing(19)))] px-4 py-12 sm:px-6 xl:py-20"
        role="main"
      >
        <section className="grid grid-cols-12 items-start lg:gap-x-8">
          {/* Videosectie */}
          <div className="col-span-12 lg:col-span-7">
            <Video
              videoUrls={{
                fallback: "https://www.youtube.com/embed/4Lyr89rL_Fg",
              }}
              overlayImage={MeasuringVideoThumb}
              title={t("a11y.measuringToolVideoTitle")}
              alt={t("a11y.measuringToolVideoAlt")}
              priority
              fetchPriority="high"
              className="rounded-t-lg lg:rounded-lg"
              sizes="
              (min-width: 1536px) calc((1536px - 48px - 32px * 11) * (7 / 12) + 32px * 6),
              (min-width: 1280px) calc((1280px - 48px - 32px * 11) * (7 / 12) + 32px * 6),
              (min-width: 1024px) calc((1024px - 48px - 32px * 11) * (7 / 12) + 32px * 6),
              (min-width: 768px) calc(768px - 48px),
              (min-width: 640px) calc(640px - 48px),
              calc(100vw - 32px)"
            />
          </div>

          {/* Calculatorsectie */}
          <section
            className="col-span-12 rounded-b-lg bg-white p-5 sm:p-10 lg:sticky lg:top-8 lg:col-span-5 lg:rounded-lg"
            role="region"
            aria-labelledby="measuring-tool-heading"
          >
            <h1 id="measuring-tool-heading" className="mb-5 text-2xl font-bold">
              {t.rich("heading", {
                sup: (chunks) => <sup>{chunks}</sup>,
              })}
            </h1>

            {/* Tabs om te wisselen tussen de twee calculator-modi */}
            <Tabs
              defaultValue="wall-profile-height"
              aria-label={t("a11y.calculatorTabsLabel")}
            >
              <TabsList role="tablist">
                <TabsTrigger value="wall-profile-height" role="tab">
                  {t("tabs.wallProfileHeight")}
                </TabsTrigger>
                <TabsTrigger value="height-lower-gutter" role="tab">
                  {t("tabs.heightBottomGutter")}
                </TabsTrigger>
              </TabsList>

              {/* Tab content voor "Bereken vanuit muurprofielhoogte" */}
              <TabsContent value="wall-profile-height" role="tabpanel">
                <PassageHeightCalculatorForm
                  formType="wallProfile"
                  mainInputLabelKey="Form.WallProfileHeight.label"
                  mainInputPlaceholderKey="Form.WallProfileHeight.placeholder"
                  mainInputTooltipKey="Form.WallProfileHeight.tooltip"
                  submitButtonTextKey="Form.Common.calculatePassageHeight"
                />
              </TabsContent>

              {/* Tab content voor "Bereken vanuit hoogte onderkant goot" */}
              <TabsContent value="height-lower-gutter" role="tabpanel">
                <PassageHeightCalculatorForm
                  formType="gutterHeight"
                  mainInputLabelKey="Form.HeightBottomGutter.label"
                  mainInputPlaceholderKey="Form.HeightBottomGutter.placeholder"
                  mainInputTooltipKey="Form.HeightBottomGutter.tooltip"
                  submitButtonTextKey="Form.Common.calculateBottomWallProfileHeight"
                />
              </TabsContent>
            </Tabs>
          </section>
        </section>
      </main>
    </>
  );
}
