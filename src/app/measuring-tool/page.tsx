import type { Metadata } from "next";
import Header from "@/components/header";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import MeasuringSlope from "/public/images/measuring-slope.jpg";
import { PassageHeightCalculatorForm } from "@/components/form/PassageHeightCalculatorForm";

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
      <main className="container mx-auto min-h-[calc(100dvh-(--spacing(19)))] px-4 py-12 sm:px-6 xl:py-20">
        <section className="grid grid-cols-12 items-start lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <Image
              src={MeasuringSlope}
              alt={t("a11y.measuringSlopeImageAlt")}
              priority
              fetchPriority="high"
              placeholder="blur"
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

          <section className="col-span-12 rounded-b-lg bg-white p-5 sm:p-10 lg:sticky lg:top-8 lg:col-span-5 lg:rounded-lg">
            <h1 className="mb-4 text-2xl font-bold">
              {t.rich("heading", {
                sup: (chunks) => <sup>{chunks}</sup>,
              })}
            </h1>

            <Tabs defaultValue="wall-profile-height">
              <TabsList>
                <TabsTrigger value="wall-profile-height">
                  {t("tabs.wallProfileHeight")}
                </TabsTrigger>
                <TabsTrigger value="height-lower-gutter">
                  {t("tabs.heightBottomGutter")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="wall-profile-height">
                <PassageHeightCalculatorForm
                  formType="wallProfile"
                  mainInputLabelKey="Form.WallProfileHeight.label"
                  mainInputPlaceholderKey="Form.WallProfileHeight.placeholder"
                  mainInputTooltipKey="Form.WallProfileHeight.tooltip"
                  submitButtonTextKey="Form.Common.calculatePassageHeight"
                />
              </TabsContent>
              <TabsContent value="height-lower-gutter">
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
