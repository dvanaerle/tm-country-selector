"use client";

import { useTranslations } from "next-intl";
import { CircleFlag } from "react-circle-flags";
import { Button } from "@/components/ui/button";
import ArrowRightLine from "../../../public/icons/MingCute/arrow_right_line.svg";
import { type StoreData } from "@/data/stores";

const getFlagCountryCode = (countryCode: string): string => {
  const flagMap: Record<string, string> = {
    "BE-NL": "be",
    "BE-FR": "be",
    EN: "gb",
  };
  return flagMap[countryCode] || countryCode.toLowerCase();
};

export function StoreCard({
  store,
  isPreferred = false,
  onSelectStore,
  disabled = false,
}: {
  store: StoreData;
  isPreferred?: boolean;
  onSelectStore: (storeUrl: string) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Components.StoreCard");

  return (
    <Button
      variant="outlineLight"
      size="md"
      fullWidth={true}
      className="group"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          onSelectStore(store.storeUrl);
        }
      }}
      aria-label={
        isPreferred
          ? t("goToStore")
          : `${t("selectCountry")}: ${store.country} (${store.language})`
      }
    >
      <div className="flex flex-1 items-center gap-x-3">
        <CircleFlag
          countryCode={getFlagCountryCode(store.countryCode)}
          title={t("a11y.flagAlt", { country: store.country })}
          width={24}
          height={24}
          className="size-6"
          role="img"
        />
        {isPreferred ? (
          <span className="text-primary-dark-green text-left">
            {t("goToStore")}
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-x-1">
            <span className="text-primary-dark-green text-left">
              {store.country}
            </span>
            <span className="text-grey text-sm">({store.language})</span>
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
