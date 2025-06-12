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

/**
 * Definieert de structuur voor afbeeldingen die in de tooltip worden weergegeven.
 */
interface InfoImage {
  src: string | StaticImageData;
  alt: string;
  captionKey?: string;
  captionValues?: Record<string, any>;
}

/**
 * Props voor de InfoTooltipSheet component.
 */
interface InfoTooltipSheetProps {
  /** De key voor de titelvertaling. */
  titleKey: string;
  /** De key voor de beschrijvingvertaling. */
  descriptionKey: string;
  /** Optionele waarden voor de beschrijvingvertaling. */
  descriptionValues?: Record<string, any>;
  /** Optionele key voor de triggertekst. */
  triggerTextKey?: string;
  /** Vertalingsfunctie van next-intl. */
  t: ReturnType<typeof useTranslations>;
  /** Een optionele lijst van afbeeldingen om weer te geven. */
  images?: InfoImage[];
}

/**
 * Een herbruikbare component die een informatie-icoon toont.
 * Bij het aanklikken wordt een "sheet" (zijpaneel) geopend met een titel,
 * beschrijving en optionele afbeeldingen.
 */
export const InfoTooltipSheet: React.FC<InfoTooltipSheetProps> = ({
  titleKey,
  descriptionKey,
  descriptionValues,
  triggerTextKey,
  t,
  images = [],
}) => {
  return (
    <Sheet>
      <SheetTrigger
        className="focus-visible:ring-neutral-medium/30 rounded outline-none focus-visible:ring-2"
        aria-label={t(triggerTextKey || "Form.Common.moreInformation")}
      >
        <InformationLine aria-hidden="true" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t(titleKey)}</SheetTitle>
          <SheetDescription className="mb-4">
            {t(descriptionKey, descriptionValues)}
          </SheetDescription>
          {images.length > 0 &&
            images.map((img, idx) => (
              <figure key={idx} className="mb-4">
                <Image
                  src={img.src}
                  alt={img.alt}
                  sizes="(min-width: 640px) calc(448px - 48px), calc(100vw - 48px)"
                  placeholder="blur"
                  className="rounded-lg"
                />
                {img.captionKey && (
                  <figcaption className="text-neutral-medium mt-2 text-center text-sm">
                    {t(img.captionKey, img.captionValues)}
                  </figcaption>
                )}
              </figure>
            ))}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
