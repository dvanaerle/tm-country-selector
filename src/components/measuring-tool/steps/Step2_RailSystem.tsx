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
  // Unieke ID voor het groepslabel (de <legend>).
  const groupLabelId = React.useId();

  return (
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
            {/* Gebruik <fieldset> om de gerelateerde radiobuttons te groeperen. */}
            <fieldset disabled={disabled} className="trans-all space-y-2">
              {/* Gebruik FormLabel met asChild om de <legend> te stylen en contextueel te linken. */}
              <FormLabel
                asChild // Dit zorgt ervoor dat FormLabel zijn kind rendert en de props doorgeeft.
                id={groupLabelId} // Pas de ID toe op de <legend>, zodat aria-labelledby ernaar kan verwijzen.
              >
                {/* Het <legend> element is het daadwerkelijke label voor de <fieldset>. */}
                {/* Pas de styling aan om rekening te houden met de 'disabled' staat van de fieldset. */}
                <legend
                  className="flex items-center gap-x-1 has-disabled:opacity-50"
                  data-required
                >
                  <span>{t("Form.WallProfileHeight.railSystemQuestion")}</span>
                  <InfoTooltipSheet
                    t={t}
                    titleKey="Form.WallProfileHeight.railSystemQuestion"
                    descriptionKey="Form.Common.slopeTooltip"
                    disabled={disabled}
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
                {/* De YesNoRadioGroup zal zelf reageren op de 'disabled' staat van de fieldset */}
                <YesNoRadioGroup
                  id={field.name}
                  name={field.name}
                  value={field.value ? valueAsBoolean : undefined}
                  onChange={handleValueChange}
                  yesLabel={t("Form.Common.yes")}
                  noLabel={t("Form.Common.no")}
                  aria-describedby={`${field.name}-error`}
                  // Essentieel voor screenreaders: koppel de radiogroep aan de ID van de <legend>.
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
