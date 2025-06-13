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
import { InfoTooltipSheet } from "../InfoTooltipSheet";
import { NumberInputWithUnit } from "../NumberInputWithUnit";
import MeasuringSlope from "/public/images/measuring-slope.jpg";

// Props voor de Step3 component.
interface Step3Props {
  // Vertalingsfunctie van next-intl.
  t: ReturnType<typeof useTranslations>;
  // Geeft aan of de fieldset uitgeschakeld moet zijn.
  disabled: boolean;
}

// Rendert de invoervelden voor stap 3: Afloop terras.
export const Step3_TerraceSlope: React.FC<Step3Props> = ({ t, disabled }) => {
  const form = useFormContext();

  return (
    // <fieldset> groepeert het gerelateerde invoerveld.
    <fieldset disabled={disabled} className="trans-all">
      {/* Geen <legend> hier, omdat er slechts één hoofd-formuliercontrole binnen deze fieldset zit. */}
      {/* Een FormLabel is voldoende voor een enkele invoer. */}

      {/* Invoerveld voor afloop */}
      <FormField
        control={form.control}
        name="slope"
        render={({ field, fieldState }) => (
          <FormItem>
            {/* FormLabel voor het specifieke invoerveld. */}
            <FormLabel
              htmlFor="slope"
              className="flex items-center gap-x-1 has-disabled:opacity-50"
            >
              <span>{t("Form.Common.slope")}</span>
              <InfoTooltipSheet
                t={t}
                disabled={disabled}
                titleKey="Form.Common.slope"
                descriptionKey="Form.Common.slopeTooltip"
                images={[
                  {
                    src: MeasuringSlope,
                    alt: "Pages.MeasuringTool.MeasuringSlopeAlt",
                    captionKey: "Form.Common.MeasuringSlopeCaption",
                  },
                ]}
              />
            </FormLabel>
            <FormControl>
              <NumberInputWithUnit
                t={t}
                id={field.name}
                value={field.value}
                onChange={field.onChange}
                placeholder={t("Form.Common.slopePlaceholder")}
                unit={t("Form.Common.measurementUnitMm")}
                aria-describedby={`${field.name}-error`}
                min={0}
                isInvalid={fieldState.invalid}
              />
            </FormControl>
            <FormMessage id={`${field.name}-error`} />
          </FormItem>
        )}
      />
    </fieldset>
  );
};
