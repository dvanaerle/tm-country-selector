"use client";

import { useTranslations } from "next-intl";
import { CircleFlag } from "react-circle-flags";
import { Button } from "@/components/ui/button";
import ArrowRightLine from "../../../public/icons/MingCute/arrow_right_line.svg";
import { type StoreData, type CountryCode } from "@/data/stores";

const FLAG_MAP: Partial<Record<CountryCode, string>> = {
  "BE-NL": "be",
  "BE-FR": "be",
  EN: "gb",
};

const getFlagCountryCode = (countryCode: CountryCode): string => {
  return FLAG_MAP[countryCode] || countryCode.toLowerCase();
};

type StoreCardProps = {
  store: StoreData;
  isPreferred?: boolean;
  onSelectStore: (storeUrl: string) => void;
  disabled?: boolean;
};

export function StoreCard({
  store,
  isPreferred = false,
  onSelectStore,
  disabled = false,
}: StoreCardProps) {
  const t = useTranslations("Components.StoreCard");

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
      className="group min-h-13 w-full px-4"
      disabled={disabled}
      onClick={handleClick}
    >
      <div className="flex flex-1 items-center gap-x-3">
        <CircleFlag
          countryCode={getFlagCountryCode(store.countryCode)}
          alt=""
          width={24}
          height={24}
          className="size-6"
        />
        {isPreferred ? (
          <span className="text-left">{t("goToStore")}</span>
        ) : (
          <div className="flex flex-wrap items-center gap-x-1.5">
            <span className="sr-only">{t("selectCountry")}</span>
            <span className="text-left">{store.countryKey}</span>
            <span className="text-muted-foreground text-sm">
              ({store.languageKey})
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
