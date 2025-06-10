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

/**
 * Props voor de Step2_RailSystem component.
 */
interface Step2RailSystemProps {
  /** Vertalingsfunctie van next-intl. */
  t: ReturnType<typeof useTranslations>;
  /** Geeft aan of de fieldset uitgeschakeld moet zijn. */
  disabled: boolean;
}

/**
 * Rendert de tweede stap van het formulier, waarin wordt gevraagd of het railsysteem verzonken is.
 * Maakt gebruik van de `YesNoRadioGroup` voor een "Ja/Nee" selectie.
 */
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
          // Adapterlogica: `react-hook-form` gebruikt hier 'checked'/'unchecked' strings,
          // terwijl `YesNoRadioGroup` met booleans werkt.
          const valueAsBoolean = field.value === "checked";

          /**
           * Converteert de boolean van `YesNoRadioGroup` terug naar de string
           * die het validatieschema van de formulierhook verwacht.
           */
          const handleValueChange = (isSelected: boolean) => {
            field.onChange(isSelected ? "checked" : "unchecked");
          };

          return (
            <FormItem>
              <fieldset className="space-y-2">
                <FormLabel asChild>
                  <legend
                    data-required
                    className="flex items-center gap-x-1 transition-opacity group-disabled:opacity-50"
                  >
                    <span>
                      {t("Form.WallProfileHeight.railSystemQuestion")}
                    </span>
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
                  />
                </FormControl>
              </fieldset>
              <FormMessage id={`${field.name}-error`} />
            </FormItem>
          );
        }}
      />
    </fieldset>
  );
};
