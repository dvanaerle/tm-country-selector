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

// Het type berekening dat wordt uitgevoerd.
type FormType = "wallProfile" | "gutterHeight";

// Props voor de Step4 component.
interface Step4Props {
  // Vertalingsfunctie van next-intl.
  t: ReturnType<typeof useTranslations>;
  // Geeft aan of de fieldset uitgeschakeld moet zijn.
  disabled: boolean;
  // Het type formulier, beïnvloedt de getoonde velden/afbeeldingen.
  formType: FormType;
  // De naam van het hoofd-invoerveld (bijv. 'wallProfileHeight').
  mainFieldName: string;
  // De vertalingskey voor het label van het hoofdveld.
  mainInputLabelKey: string;
  // De vertalingskey voor de placeholder van het hoofdveld.
  mainInputPlaceholderKey: string;
  // De vertalingskey voor de tooltip van het hoofdveld.
  mainInputTooltipKey: string;
}

// Rendert de invoervelden voor stap 4: Hoogte onderkant muurprofiel.
export const Step4_HeightBottomWallProfile: React.FC<Step4Props> = ({
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
    // <fieldset> groepeert het gerelateerde invoerveld.
    <fieldset disabled={disabled} className="trans-all">
      {/* Geen <legend> hier, omdat er slechts één hoofd-formuliercontrole binnen deze fieldset zit. */}
      {/* Een FormLabel is voldoende voor een enkele invoer. */}

      {/* Hoofdinvoerveld voor hoogte onderkant muurprofiel */}
      <FormField
        control={form.control}
        name={mainFieldName}
        render={({ field, fieldState }) => (
          <FormItem>
            {/* FormLabel voor het specifieke invoerveld. */}
            <FormLabel
              htmlFor={field.name} // De htmlFor matcht de ID van de NumberInputWithUnit.
              data-required
              className="flex items-center gap-x-1 has-disabled:opacity-50"
            >
              <span>{t(mainInputLabelKey)}</span>
              <InfoTooltipSheet
                t={t}
                disabled={disabled}
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
                id={field.name} // De ID matcht de htmlFor van FormLabel.
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
