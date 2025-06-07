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
import { YesNoRadioGroup } from "../YesNoRadioGroup";
import MeasuringHeightRecessed from "/public/images/measuring-height-recessed.jpg";

// Type definitions for component props
interface Step2RailSystemProps {
  t: ReturnType<typeof useTranslations>;
  disabled: boolean;
}

// Renders the rail system slope question step in the calculator form.
export const Step2_RailSystem: React.FC<Step2RailSystemProps> = ({
  t,
  disabled,
}) => {
  const form = useFormContext();

  return (
    <fieldset
      disabled={disabled}
      className="group transition-opacity duration-300"
    >
      <FormField
        control={form.control}
        name="railSystemSlope"
        render={({ field }) => {
          // Adapter logic to translate between the form's string values and the component's boolean values.
          const valueAsBoolean = field.value === "checked";

          const handleValueChange = (isSelected: boolean) => {
            // Convert boolean back to the string value the validation schema expects.
            field.onChange(isSelected ? "checked" : "unchecked");
          };

          return (
            <FormItem>
              <FormLabel
                data-required
                className="flex items-center gap-x-1 transition-opacity group-disabled:opacity-50"
              >
                <span>{t("Form.WallProfileHeight.railSystemQuestion")}</span>
                <InfoTooltipSheet
                  t={t}
                  titleKey="Form.WallProfileHeight.railSystemQuestion"
                  descriptionKey="Form.Common.slopeTooltip"
                  images={[
                    {
                      src: MeasuringHeightRecessed,
                      alt: "Pages.MeasuringTool.MeasuringHeightRecessedAlt",
                      captionKey:
                        "Form.WallProfileHeight.MeasuringHeightRecessedCaption",
                    },
                  ]}
                />
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
                />
              </FormControl>
              <FormMessage id={`${field.name}-error`} />
            </FormItem>
          );
        }}
      />
    </fieldset>
  );
};
