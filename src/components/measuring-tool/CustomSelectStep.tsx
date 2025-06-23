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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rangeMidpoint } from "./rangeMidpointUtil";
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

export const GUTTER_HEIGHT_RANGE_OPTIONS = [
  { value: "1980-2020", label: "1980-2020 mm" },
  { value: "2030-2070", label: "2030-2070 mm" },
  { value: "2080-2120", label: "2080-2120 mm" },
  { value: "2130-2170", label: "2130-2170 mm" },
  { value: "2180-2220", label: "2180-2220 mm" },
  { value: "2230-2270", label: "2230-2270 mm" },
  { value: "2280-2320", label: "2280-2320 mm" },
  { value: "2330-2370", label: "2330-2370 mm" },
  { value: "2380-2420", label: "2380-2420 mm" },
  { value: "2480-2520", label: "2480-2520 mm" },
];

// Specifieke component voor dropdown selectie met bereik opties
// Converteert tussen string bereiken en numerieke middelpunten voor interne verwerking
export const CustomSelectStep: React.FC<Props> = ({ config, t, disabled }) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => {
        // Bepaal de geselecteerde waarde voor de Select component (voor gecontroleerde select)
        let selectedRange = "";
        if (typeof field.value === "string") {
          selectedRange = field.value;
        } else if (typeof field.value === "number") {
          // Zoek het bereik dat overeenkomt met de numerieke waarde
          selectedRange =
            GUTTER_HEIGHT_RANGE_OPTIONS.find(
              (opt) => rangeMidpoint(opt.value) === field.value,
            )?.value ?? "";
        }
        return (
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
              <Select
                value={selectedRange}
                onValueChange={(val) => {
                  // Zet de bereik-string altijd om naar het juiste middelpunt.
                  field.onChange(rangeMidpoint(val));
                }}
                disabled={disabled}
                name={field.name}
              >
                <SelectTrigger
                  className="w-full"
                  id={field.name}
                  aria-labelledby={`${field.name}-label ${field.name}-value`}
                >
                  <SelectValue
                    placeholder={
                      config.placeholderKey ? t(config.placeholderKey) : ""
                    }
                    id={`${field.name}-value`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {GUTTER_HEIGHT_RANGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage id={`${field.name}-error`} />
          </FormItem>
        );
      }}
    />
  );
};
