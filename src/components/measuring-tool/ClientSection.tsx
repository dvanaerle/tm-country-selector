"use client";

// Nederlands commentaar: Deze component bevat Tabs, afbeelding en forms.
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PassageHeightCalculatorForm } from "@/components/measuring-tool/PassageHeightCalculatorForm";
import { ImageSwitcher } from "@/components/measuring-tool/ImageSwitcher";
import MeasuringHeightPaving from "/public/images/measuring-height-paving.jpg";
import MeasuringHeightRecessed from "/public/images/measuring-height-recessed.jpg";

interface ClientSectionProps {
  measuringHeightPavingAlt: string;
  measuringHeightRecessedAlt: string;
  tabsHeightBottomGutter: string;
  tabsWallProfileHeight: string;
  heading: React.ReactNode;
}

export const ClientSection: React.FC<ClientSectionProps> = ({
  measuringHeightPavingAlt,
  measuringHeightRecessedAlt,
  tabsHeightBottomGutter,
  tabsWallProfileHeight,
  heading,
}) => {
  const [selectedTab, setSelectedTab] = useState<
    "height-lower-gutter" | "wall-profile-height"
  >("height-lower-gutter");

  // Bepaal afbeelding en alt op basis van geselecteerde tab
  const imageObj =
    selectedTab === "height-lower-gutter"
      ? MeasuringHeightPaving
      : MeasuringHeightRecessed;
  const imageAlt =
    selectedTab === "height-lower-gutter"
      ? measuringHeightPavingAlt
      : measuringHeightRecessedAlt;

  return (
    <section className="grid grid-cols-12 items-start lg:gap-x-10">
      {/* Afbeelding */}
      <div className="col-span-12 lg:sticky lg:top-6 lg:col-span-7">
        <ImageSwitcher
          src={
            selectedTab === "height-lower-gutter"
              ? MeasuringHeightPaving
              : MeasuringHeightRecessed
          }
          alt={
            selectedTab === "height-lower-gutter"
              ? measuringHeightPavingAlt
              : measuringHeightRecessedAlt
          }
          selectedTab={selectedTab}
        />
      </div>

      {/* Calculator + tabs */}
      <section
        className="col-span-12 rounded-b-lg bg-white p-5 lg:col-span-5 lg:rounded-lg xl:p-10"
        role="region"
        aria-labelledby="measuring-tool-heading"
      >
        <h1 id="measuring-tool-heading" className="mb-5 text-2xl font-bold">
          {heading}
        </h1>
        <Tabs
          defaultValue="height-lower-gutter"
          value={selectedTab}
          onValueChange={(value) =>
            setSelectedTab(
              value as "height-lower-gutter" | "wall-profile-height",
            )
          }
        >
          <TabsList role="tablist">
            <TabsTrigger value="height-lower-gutter" role="tab">
              {tabsHeightBottomGutter}
            </TabsTrigger>
            <TabsTrigger value="wall-profile-height" role="tab">
              {tabsWallProfileHeight}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wall-profile-height" role="tabpanel">
            <PassageHeightCalculatorForm
              formType="wallProfile"
              mainInputLabelKey="Form.WallProfileHeight.label"
              mainInputPlaceholderKey="Form.WallProfileHeight.placeholder"
              mainInputTooltipKey="Form.WallProfileHeight.tooltip"
              submitButtonTextKey="Form.Common.calculatePassageHeight"
            />
          </TabsContent>
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
  );
};
