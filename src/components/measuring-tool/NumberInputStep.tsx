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

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel
            htmlFor={field.name}
            className="flex items-center gap-x-1 has-disabled:opacity-50"
            data-required
          >
            <span>{t(config.labelKey)}</span>
            {isDefinedString(config.tooltipKey) && (
              <InfoTooltipSheet
                t={t}
                titleKey={config.labelKey}
                descriptionKey={config.tooltipKey}
                images={config.images}
                disabled={disabled}
              />
            )}
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
        </FormItem>
      )}
    />
  );
};
