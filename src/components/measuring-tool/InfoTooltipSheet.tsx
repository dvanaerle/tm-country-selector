import React from "react";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import InformationLine from "../../../public/icons/MingCute/information_line.svg";

// Definieert de structuur voor afbeeldingen die in de tooltip worden weergegeven.
interface InfoImage {
  src: string | StaticImageData;
  alt: string;
}

// Props voor de InfoTooltipSheet component.
interface InfoTooltipSheetProps {
  // De key voor de titelvertaling.
  titleKey: string;
  // De key voor de beschrijvingvertaling.
  descriptionKey: string;
  // Optionele waarden voor de beschrijvingvertaling.
  descriptionValues?: Record<string, any>;
  // Optionele key voor de triggertekst.
  triggerTextKey?: string;
  // Vertalingsfunctie van next-intl.
  t: ReturnType<typeof useTranslations>;
  // Een optionele lijst van afbeeldingen om weer te geven.
  images?: InfoImage[];
  disabled?: boolean;
}

// Een herbruikbare component die een informatie-icoon toont.
// Bij het aanklikken wordt een "sheet" (zijpaneel) geopend met een titel,
// beschrijving en optionele afbeeldingen.
export const InfoTooltipSheet: React.FC<InfoTooltipSheetProps> = ({
  titleKey,
  descriptionKey,
  descriptionValues,
  triggerTextKey,
  t,
  images = [],
  disabled,
}) => {
  return (
    <Sheet>
      <SheetTrigger
        className="focus-visible:ring-ring/50 text-info enabled:hover:bg-info-background rounded p-1 outline-none focus-visible:ring-2 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6"
        aria-label={t(
          triggerTextKey || "Components.Form.Common.moreInformation",
        )}
        disabled={disabled}
      >
        <InformationLine aria-hidden="true" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t(titleKey)}</SheetTitle>
          <SheetDescription className="mb-4">
            {t.rich(descriptionKey, {
              ...descriptionValues,
              sup: (chunks: React.ReactNode) => <sup>{chunks}</sup>,
              br: () => (
                <>
                  <br />
                  <br />
                </>
              ),
            })}
          </SheetDescription>
          {images.length > 0 &&
            images.map((img, idx) => (
              <div key={idx} className="mb-4">
                <Image
                  src={img.src}
                  alt={t(img.alt)}
                  sizes="(min-width: 640px) calc(448px - 48px), calc(100vw - 48px)"
                  placeholder="blur"
                  className="rounded-lg"
                />
              </div>
            ))}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
