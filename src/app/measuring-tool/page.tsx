import type { Metadata } from "next";
import Header from "@/components/header";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import measuringSlope from "/public/images/measuring-slope.jpg";
import { WallProfileHeightForm } from "@/components/form/WallProfileHeight";
import { HeightLowerGutterForm } from "@/components/form/HeightLowerGutter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.MeasuringTool.Metadata");

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
      <main className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] flex-col items-center px-4 py-12 sm:px-6 xl:py-20">
        {/* <main className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] flex-col items-center px-4 py-12 sm:px-6 md:max-w-(--breakpoint-md) xl:py-20"> */}
        <section className="grid w-full gap-10 rounded-lg bg-white p-4 sm:p-10 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <Image
              src={measuringSlope}
              alt={t("a11y.imageAlt")}
              priority
              fetchPriority="high"
              placeholder="blur"
              className="rounded-sm"
              sizes="
                 (min-width: 1536px) calc((1536px - 48px),
                 (min-width: 1280px) calc((1280px - 48px),
                 (min-width: 1024px) calc(1024px - 48px),
                 (min-width: 768px) calc(768px - 48px),
                 (min-width: 640px) calc(640px - 48px),
                 calc(100vw - 32px)"
            />
          </section>

          <section className="lg:col-span-5">
            <h1 className="mb-6">
              {t.rich("heading", {
                sup: (chunks) => <sup>{chunks}</sup>,
              })}
            </h1>

            <Tabs>
              <TabsList>
                <TabsTrigger value="wall-profile-height">
                  {t("tabs.wallProfileHeight")}
                </TabsTrigger>
                <TabsTrigger value="height-lower-gutter">
                  {t("tabs.heightLowerGutter")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="wall-profile-height">
                <WallProfileHeightForm />
              </TabsContent>
              <TabsContent value="height-lower-gutter">
                <HeightLowerGutterForm />
              </TabsContent>
            </Tabs>
          </section>
        </section>
      </main>
    </>
  );
}
