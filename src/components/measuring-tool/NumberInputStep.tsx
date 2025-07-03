import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InfoTooltipSheet } from "./InfoTooltipSheet";
import { NumberInputWithUnit } from "./NumberInputWithUnit";
import { FormStepConfig } from "./formStepsConfig";
import {
  usePassageHeightCalculator,
  FormValues,
  FOUNDATION_WARNING_THRESHOLD,
} from "@/hooks/usePassageHeightCalculator";
import { FoundationWarning } from "./FoundationWarning";

// Type guard om te controleren of een waarde een gedefinieerde niet-lege string is
function isDefinedString(val: unknown): val is string {
  return typeof val === "string" && val.length > 0;
}

type Props = {
  config: FormStepConfig;
  t: ReturnType<typeof useTranslations>;
  disabled?: boolean;
};

// Specifieke component voor numerieke input velden met eenheid
// Verzorgt validatie en formattering van numerieke waarden
export const NumberInputStep: React.FC<Props> = ({ config, t, disabled }) => {
  const form = useFormContext();
  const groupLabelId = React.useId();

  // Watch alle benodigde velden voor de berekening
  const watchedValues = form.watch();
  const isWallProfileStep = config.name === "wallProfileHeight";

  // Hook voor berekeningen (alleen gebruiken voor wallProfileHeight)
  const { calculateResult } = usePassageHeightCalculator("wallProfile");

  // Bereken passage height alleen als alle vereiste velden ingevuld zijn
  let showWarning = false;
  if (
    isWallProfileStep &&
    watchedValues.wallProfileHeight != null &&
    watchedValues.depth != null &&
    watchedValues.railSystemSlope != null
  ) {
    try {
      // We casten expliciet naar FormValues om typefout te voorkomen
      const result = calculateResult(watchedValues as FormValues);
      showWarning = result.output > FOUNDATION_WARNING_THRESHOLD;
    } catch (error) {
      // Bij fout in berekening geen waarschuwing tonen
      showWarning = false;
    }
  }

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel
            htmlFor={field.name}
            className="flex items-center gap-x-1.5 has-disabled:opacity-50"
            data-required={isWallProfileStep || undefined}
          >
            {isDefinedString(config.tooltipKey) && (
              <InfoTooltipSheet
                t={t}
                titleKey={config.labelKey}
                descriptionKey={config.tooltipKey}
                images={config.images}
                disabled={disabled}
              />
            )}
            <span>{t(config.labelKey)}</span>
          </FormLabel>
          <FormControl>
            <NumberInputWithUnit
              t={t}
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              placeholder={
                config.placeholderKey ? t(config.placeholderKey) : ""
              }
              unit={config.unitKey ? t(config.unitKey) : ""}
              aria-describedby={`${field.name}-error`}
              min={config.min}
              max={config.max}
              isInvalid={fieldState.invalid}
              aria-labelledby={groupLabelId}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage id={`${field.name}-error`} />
          {showWarning && <FoundationWarning t={t} />}
        </FormItem>
      )}
    />
  );
};
