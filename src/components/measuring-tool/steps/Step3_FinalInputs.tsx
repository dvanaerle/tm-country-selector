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
import MeasuringHeightPaving from "/public/images/measuring-height-paving.jpg";
import MeasuringHeightRecessed from "/public/images/measuring-height-recessed.jpg";
import MeasuringSlope from "/public/images/measuring-slope.jpg";

/** Het type berekening dat wordt uitgevoerd. */
type FormType = "wallProfile" | "gutterHeight";

/**
 * Props voor de Step3_FinalInputs component.
 */
interface Step3FinalInputsProps {
  /** Vertalingsfunctie van next-intl. */
  t: ReturnType<typeof useTranslations>;
  /** Geeft aan of de fieldset uitgeschakeld moet zijn. */
  disabled: boolean;
  /** Het type formulier, beïnvloedt de getoonde velden/afbeeldingen. */
  formType: FormType;
  /** De naam van het hoofd-invoerveld (bijv. 'wallProfileHeight'). */
  mainFieldName: string;
  /** De vertalingskey voor het label van het hoofdveld. */
  mainInputLabelKey: string;
  /** De vertalingskey voor de placeholder van het hoofdveld. */
  mainInputPlaceholderKey: string;
  /** De vertalingskey voor de tooltip van het hoofdveld. */
  mainInputTooltipKey: string;
}

/**
 * Rendert de laatste invoervelden (stap 3): Afloop terras en Hoogte onderkant muurprofiel.
 */
export const Step3_FinalInputs: React.FC<Step3FinalInputsProps> = ({
  t,
  disabled,
  formType,
  mainFieldName,
  mainInputLabelKey,
  mainInputPlaceholderKey,
  mainInputTooltipKey,
}) => {
  const form = useFormContext();

  return (
    <fieldset
      disabled={disabled}
      className="group space-y-6 transition-opacity duration-300"
    >
      {/* Invoerveld voor afloop */}
      <FormField
        control={form.control}
        name="slope"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              htmlFor="slope"
              className="flex items-center gap-x-1 transition-opacity group-disabled:opacity-50"
            >
              <span>{t("Form.Common.slope")}</span>
              <InfoTooltipSheet
                t={t}
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
                id="slope"
                value={field.value}
                onChange={field.onChange}
                placeholder={t("Form.Common.slopePlaceholder")}
                unit={t("Form.Common.measurementUnitMm")}
                aria-describedby={`${field.name}-error`}
                min={0}
              />
            </FormControl>
            <FormMessage id={`${field.name}-error`} />
          </FormItem>
        )}
      />

      {/* Hoofdinvoerveld voor hoogte onderkant muurprofiel */}
      <FormField
        control={form.control}
        name={mainFieldName}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel
              htmlFor={field.name}
              data-required
              className="flex items-center gap-x-1 transition-opacity group-disabled:opacity-50"
            >
              <span>{t(mainInputLabelKey)}</span>
              <InfoTooltipSheet
                t={t}
                titleKey={mainInputLabelKey}
                descriptionKey={mainInputTooltipKey}
                images={[
                  {
                    // De afbeelding is afhankelijk van het formuliertype.
                    src:
                      formType === "wallProfile"
                        ? MeasuringHeightPaving
                        : MeasuringHeightRecessed,
                    alt:
                      formType === "wallProfile"
                        ? "Pages.MeasuringTool.MeasuringHeightPavingAlt"
                        : "Pages.MeasuringTool.MeasuringHeightRecessedAlt",
                    captionKey:
                      "Form.WallProfileHeight.MeasuringHeightPavingCaption",
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
                placeholder={t(mainInputPlaceholderKey)}
                min={0}
                unit={t("Form.Common.measurementUnitMm")}
                aria-describedby={`${field.name}-error`}
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
