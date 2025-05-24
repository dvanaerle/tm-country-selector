import React from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface InfoTooltipSheetProps {
  titleKey: string;
  descriptionKey: string;
  descriptionValues?: Record<string, any>;
  triggerTextKey?: string;
  t: ReturnType<typeof useTranslations>;
}

export const InfoTooltipSheet = ({
  titleKey,
  descriptionKey,
  descriptionValues,
  triggerTextKey = "Form.Common.info",
  t,
}: InfoTooltipSheetProps) => (
  <Sheet>
    <SheetTrigger>{t(triggerTextKey)}</SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{t(titleKey)}</SheetTitle>
        <SheetDescription>
          {t(descriptionKey, descriptionValues)}
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
);
