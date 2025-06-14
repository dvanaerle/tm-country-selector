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
import * as RadioGroupCards from "@radix-ui/react-radio-group";
import { InfoTooltipSheet } from "../InfoTooltipSheet";
import MeasuringWidthFront from "/public/images/measuring-width-front.jpg";
import MeasuringWidthSide from "/public/images/measuring-width-side.jpg";

// Definieert de structuur van een diepte-optie voor de radiogroep.
interface DepthOption {
  value: string;
  label: string;
}

// Props voor de Step1_Depth component.
interface Step1DepthProps {
  // Vertalingsfunctie van next-intl.
  t: ReturnType<typeof useTranslations>;
  // Een lijst van beschikbare diepte-opties.
  depthOptions: DepthOption[];
}

// Rendert de eerste stap van het formulier: Diepte terrasoverkapping.
// Maakt gebruik van een radiogroep met card-stijl voor de selectie.
export const Step1_Depth: React.FC<Step1DepthProps> = ({ t, depthOptions }) => {
  const form = useFormContext();
  // Unieke ID voor het groepslabel (de <legend>).
  const groupLabelId = React.useId();

  return (
    <FormField
      control={form.control}
      name="depth"
      render={({ field }) => (
        <FormItem>
          {/* Gebruik <fieldset> om de radiobuttons semantisch te groeperen. */}
          <fieldset className="trans-all space-y-2">
            {/* Gebruik FormLabel met asChild om de <legend> te stylen en contextueel te linken. */}
            <FormLabel
              asChild // Dit zorgt ervoor dat FormLabel zijn kind rendert en de props doorgeeft.
              id={groupLabelId} // Pas de ID toe op de <legend>, zodat aria-labelledby ernaar kan verwijzen.
            >
              {/* Het <legend> element is het daadwerkelijke label voor de <fieldset>. */}
              <legend className="flex items-center gap-x-1" data-required>
                <span>{t("Form.Common.depthVeranda")}</span>
                <InfoTooltipSheet
                  t={t}
                  titleKey="Form.Common.depthVeranda"
                  descriptionKey="Form.Common.depthVerandaTooltip"
                  images={[
                    {
                      src: MeasuringWidthFront,
                      alt: "Pages.MeasuringTool.MeasuringWidthFrontAlt",
                      captionKey: "Form.Common.MeasuringWidthFrontCaption",
                    },
                    {
                      src: MeasuringWidthSide,
                      alt: "Pages.MeasuringTool.MeasuringWidthSideAlt",
                      captionKey: "Form.Common.MeasuringWidthSideCaption",
                    },
                  ]}
                />
              </legend>
            </FormLabel>
            <FormControl>
              <RadioGroupCards.Root
                name={field.name}
                className="flex flex-wrap gap-2"
                onValueChange={field.onChange}
                value={field.value?.toString() ?? ""}
                aria-describedby={`${field.name}-error`}
                // Essentieel voor screenreaders: koppel de radiogroep aan de ID van de <legend>.
                aria-labelledby={groupLabelId}
                // Geen 'id' direct nodig op RadioGroupCards.Root voor htmlFor van FormLabel,
                // aangezien de 'for' van FormLabel wordt omzeild door asChild.
              >
                {depthOptions.map((option) => (
                  <RadioGroupCards.Item
                    key={option.value}
                    value={option.value}
                    className="focus-visible:ring-ring/50 data-[state=checked]:text-primary text-muted-foreground data-[state=checked]:border-primary focus-visible:border-ring hover:bg-muted/30 data-[state=checked]:bg-muted/30 border-input min-h-12 rounded border px-4 py-2.75 outline-none focus-visible:ring-2 data-[state=checked]:font-semibold"
                  >
                    <span>{option.label}</span>
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
