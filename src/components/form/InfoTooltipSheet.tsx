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

// Type for an image with an optional caption
interface InfoImage {
  src: string | StaticImageData;
  alt: string;
  captionKey?: string;
  captionValues?: Record<string, any>;
}

interface InfoTooltipSheetProps {
  titleKey: string;
  descriptionKey: string;
  descriptionValues?: Record<string, any>;
  triggerTextKey?: string;
  t: ReturnType<typeof useTranslations>;
  images?: InfoImage[];
}

export const InfoTooltipSheet = ({
  titleKey,
  descriptionKey,
  descriptionValues,
  triggerTextKey,
  t,
  images,
}: InfoTooltipSheetProps) => (
  <Sheet>
    <SheetTrigger
      aria-label={t(triggerTextKey || "Form.Common.moreInformation")}
    >
      <InformationLine />
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{t(titleKey)}</SheetTitle>
        <SheetDescription className="mb-4">
          {t(descriptionKey, descriptionValues)}
        </SheetDescription>
        {images &&
          images.length > 0 &&
          images.map((img, idx) => (
            <figure key={idx} className="mb-4">
              <Image
                src={img.src}
                alt={img.alt}
                sizes="
                 (min-width: 640px) calc(448px - 48px),
                 calc(100vw - 48px)"
                placeholder="blur"
                className="rounded-lg"
              />
              {img.captionKey && (
                <figcaption className="text-grey mt-2 text-center text-sm">
                  {t(img.captionKey, img.captionValues)}
                </figcaption>
              )}
            </figure>
          ))}
      </SheetHeader>
    </SheetContent>
  </Sheet>
);
