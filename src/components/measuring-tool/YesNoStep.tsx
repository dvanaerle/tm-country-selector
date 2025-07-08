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
import { YesNoRadioGroup } from "./YesNoRadioGroup";
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

// Specifieke component voor ja/nee vragen in het formulier
// Converteert tussen boolean waarden en de verwachte string representatie
export const YesNoStep: React.FC<Props> = ({ config, t, disabled }) => {
  const form = useFormContext();
  const groupLabelId = React.useId();

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => {
        const valueAsBoolean = field.value === "checked";
        const handleValueChange = (isSelected: boolean) => {
          field.onChange(isSelected ? "checked" : "unchecked");
        };
        return (
          <FormItem>
            <fieldset disabled={disabled} className="trans-all space-y-2">
              <FormLabel asChild id={groupLabelId}>
                <legend
                  className="flex items-center gap-x-1.5 has-disabled:opacity-50"
                  data-required
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
                </legend>
              </FormLabel>
              <FormControl>
                <YesNoRadioGroup
                  id={field.name}
                  name={field.name}
                  value={field.value ? valueAsBoolean : undefined}
                  onChange={handleValueChange}
                  yesLabel={t("Components.Form.Common.yes")}
                  noLabel={t("Components.Form.Common.no")}
                  aria-describedby={`${field.name}-error`}
                  aria-labelledby={groupLabelId}
                />
              </FormControl>
              <FormMessage id={`${field.name}-error`} />
            </fieldset>
          </FormItem>
        );
      }}
    />
  );
};
