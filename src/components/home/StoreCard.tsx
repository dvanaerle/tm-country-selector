"use client";

import { useTranslations } from "next-intl";
import { CircleFlag } from "react-circle-flags";
import { Button } from "@/components/ui/button";
import ArrowRightLine from "../../../public/icons/MingCute/arrow_right_line.svg";
import { type StoreData } from "@/data/stores";

// Vertaalt een landcode naar een vlagcode die door `react-circle-flags` wordt ondersteund.
const getFlagCountryCode = (countryCode: string): string => {
  const flagMap: Record<string, string> = {
    "BE-NL": "be",
    "BE-FR": "be",
    EN: "gb",
  };
  return flagMap[countryCode] || countryCode.toLowerCase();
};

// Props voor de StoreCard component.
interface StoreCardProps {
  // De data van de store.
  store: StoreData;
  // Geeft aan of dit de voorkeurselectie is.
  isPreferred?: boolean;
  // Callback-functie die wordt aangeroepen bij selectie.
  onSelectStore: (storeUrl: string) => void;
  // Geeft aan of de card is uitgeschakeld.
  disabled?: boolean;
}

// Rendert een klikbare card voor een specifiek land.
export function StoreCard({
  store,
  isPreferred = false,
  onSelectStore,
  disabled = false,
}: StoreCardProps) {
  const t = useTranslations("Components.StoreCard");

  // Behandelt de klik op de card en roept de `onSelectStore` callback aan.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!disabled) {
      onSelectStore(store.storeUrl);
    }
  };

  return (
    <Button
      type="button"
      variant="border"
      className="group min-h-12 w-full px-4"
      disabled={disabled}
      onClick={handleClick}
    >
      <div className="flex flex-1 items-center gap-x-3">
        <CircleFlag
          countryCode={getFlagCountryCode(store.countryCode)}
          title={t("a11y.flagAlt", { country: store.country })}
          alt={t("a11y.flagAlt", { country: store.country })}
          width={24}
          height={24}
          className="size-6"
        />
        {isPreferred ? (
          <span className="text-left">{t("goToStore")}</span>
        ) : (
          <div className="flex flex-wrap items-center gap-x-1.5">
            <span className="sr-only">{t("selectCountry")}</span>
            <span className="text-left">{store.country}</span>
            <span className="text-muted-foreground text-sm">
              ({store.language})
            </span>
          </div>
        )}
      </div>
      <ArrowRightLine
        className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden="true"
      />
    </Button>
  );
}
