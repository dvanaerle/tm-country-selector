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
import * as RadioGroupCards from "@radix-ui/react-radio-group";
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

// Specifieke component voor radio group stappen in het formulier
// Hanteert de rendering van keuze-opties met visuele kaarten
export const RadioGroupStep: React.FC<Props> = ({ config, t, disabled }) => {
  const form = useFormContext();
  const groupLabelId = React.useId();

  if (!Array.isArray(config.options)) {
    return null;
  }

  const options = config.options; // TypeScript verzekert ons dat dit een array is door de type guard

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem>
          <fieldset disabled={disabled} className="trans-all space-y-2">
            <FormLabel asChild id={groupLabelId}>
              <legend
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
              </legend>
            </FormLabel>
            <FormControl>
              <RadioGroupCards.Root
                name={field.name}
                className="flex flex-wrap gap-2"
                onValueChange={field.onChange}
                value={field.value?.toString() ?? ""}
                aria-describedby={`${field.name}-error`}
                aria-labelledby={groupLabelId}
              >
                {options.map((option) => (
                  <RadioGroupCards.Item
                    key={option.value}
                    value={option.value}
                    className="focus-visible:ring-ring/50 data-[state=checked]:text-primary text-muted-foreground data-[state=checked]:border-primary focus-visible:border-ring hover:bg-muted/30 data-[state=checked]:bg-muted/30 border-input min-h-12 rounded border px-4 py-2.75 outline-none focus-visible:ring-2 data-[state=checked]:font-semibold"
                  >
                    <span>
                      {option.labelKey.match(/^\d/)
                        ? `${option.value} ${t("Form.Common.measurementUnitMeter")}`
                        : t(option.labelKey)}
                    </span>
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
