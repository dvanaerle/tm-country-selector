import React, { useState } from "react";
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
import { YesNoRadioGroup } from "./YesNoRadioGroup";
import * as RadioGroupCards from "@radix-ui/react-radio-group";
import { FormStepConfig } from "./formStepsConfig";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility
function parseMidpoint(range: string): number | null {
  const match = range.match(/^(\d+)-(\d+)$/);
  if (!match) return null;
  const [, a, b] = match;
  return Math.round((parseInt(a, 10) + parseInt(b, 10)) / 2);
}

// Helper for safe string
function isDefinedString(val: unknown): val is string {
  return typeof val === "string" && val.length > 0;
}

type Props = {
  config: FormStepConfig;
  t: ReturnType<typeof useTranslations>;
  disabled?: boolean;
};

export const gutterHeightRangeOptions = [
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

export const FormStep: React.FC<Props> = ({ config, t, disabled }) => {
  const form = useFormContext();
  const groupLabelId = React.useId();

  if (config.type === "radio-group" && Array.isArray(config.options)) {
    const options = config.options; // This is now always an array!

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
  }

  if (config.type === "yes-no") {
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
                    className="flex items-center gap-x-1 has-disabled:opacity-50"
                    data-required
                  >
                    <span>{t(config.labelKey)}</span>
                    {isDefinedString(config.tooltipKey) ? (
                      <InfoTooltipSheet
                        t={t}
                        titleKey={config.labelKey}
                        descriptionKey={config.tooltipKey}
                        images={config.images}
                        disabled={disabled}
                      />
                    ) : null}
                  </legend>
                </FormLabel>
                <FormControl>
                  <YesNoRadioGroup
                    id={field.name}
                    name={field.name}
                    value={field.value ? valueAsBoolean : undefined}
                    onChange={handleValueChange}
                    yesLabel={t("Form.Common.yes")}
                    noLabel={t("Form.Common.no")}
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
  }

  if (config.type === "number-input") {
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
  }

  if (config.type === "custom-select") {
    return (
      <FormField
        control={form.control}
        name={config.name}
        render={({ field }) => {
          // Determine the Select's value (for controlled select)
          let selectedRange = "";
          if (typeof field.value === "string") {
            selectedRange = field.value;
          } else if (typeof field.value === "number") {
            selectedRange =
              gutterHeightRangeOptions.find(
                (opt) => parseMidpoint(opt.value) === field.value,
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
                    field.onChange(parseMidpoint(val));
                  }}
                  disabled={disabled}
                  name={field.name}
                >
                  <SelectTrigger className="w-full" id={field.name}>
                    <SelectValue
                      placeholder={
                        config.placeholderKey ? t(config.placeholderKey) : ""
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {gutterHeightRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          );
        }}
      />
    );
  }

  return null;
};
