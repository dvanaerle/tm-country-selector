import React from "react";
import { useFormContext } from "react-hook-form";
import type { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as RadioGroupCards from "@radix-ui/react-radio-group";
import { InfoTooltipSheet } from "../InfoTooltipSheet";
import MeasuringWidthFront from "/public/images/measuring-width-front.jpg";
import MeasuringWidthSide from "/public/images/measuring-width-side.jpg";

/**
 * Definieert de structuur van een diepte-optie voor de radiogroep.
 */
interface DepthOption {
  value: string;
  label: string;
}

/**
 * Props voor de Step1_Depth component.
 */
interface Step1DepthProps {
  /** Vertalingsfunctie van next-intl. */
  t: ReturnType<typeof useTranslations>;
  /** Een lijst van beschikbare diepte-opties. */
  depthOptions: DepthOption[];
}

/**
 * Rendert de eerste stap van het formulier: Diepte terrasoverkapping.
 * Maakt gebruik van een radiogroep met card-stijl voor de selectie.
 */
export const Step1_Depth: React.FC<Step1DepthProps> = ({ t, depthOptions }) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="depth"
      render={({ field }) => (
        <FormItem>
          <fieldset className="space-y-2">
            <FormLabel asChild>
              <legend data-required className="flex items-center gap-x-1">
                <span>{t("Form.Common.depthVeranda")}</span>
                <InfoTooltipSheet
                  t={t}
                  titleKey="Form.Common.depthVeranda"
                  descriptionKey="Form.Common.depthVerandaTooltip"
                  images={[
                    {
                      src: MeasuringWidthFront,
                      alt: "Pages.MeasuringTool.MeasuringWidthFrontAlt",
                      captionKey: "Form.Common.MeasuringWidthFrontCaption",
                    },
                    {
                      src: MeasuringWidthSide,
                      alt: "Pages.MeasuringTool.MeasuringWidthSideAlt",
                      captionKey: "Form.Common.MeasuringWidthSideCaption",
                    },
                  ]}
                />
              </legend>
            </FormLabel>
            <FormControl>
              <RadioGroupCards.Root
                name={field.name}
                className="flex flex-wrap gap-2"
                onValueChange={field.onChange}
                value={field.value?.toString() ?? ""}
                aria-describedby={`${field.name}-error`}
              >
                {depthOptions.map((option) => (
                  <RadioGroupCards.Item
                    key={option.value}
                    value={option.value}
                    className="focus-visible:ring-grey/50 border-light-grey data-[state=checked]:text-green text-grey data-[state=checked]:border-green focus-visible:border-green rounded border px-3 py-1.5 text-sm outline-none focus-visible:ring-2 data-[state=checked]:font-semibold"
                  >
                    <span>{option.label}</span>
                  </RadioGroupCards.Item>
                ))}
              </RadioGroupCards.Root>
            </FormControl>
            <FormMessage id={`${field.name}-error`} />
          </fieldset>
        </FormItem>
      )}
    />
  );
};
