"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ArrowRightLine from "@/components/icons/arrow_right_line";

export type StoreData = {
  countryCode: string;
  country: string;
  language: string;
  storeUrl: string;
  flagIcon: string;
};

export function StoreCard({
  store,
  isPreferred = false,
  onSelectStore,
}: {
  store: StoreData;
  isPreferred?: boolean;
  onSelectStore: (storeUrl: string) => void;
}) {
  const t = useTranslations("Home");

  return (
    <Button
      variant="outlineLight"
      size="md"
      fullWidth={true}
      className="group"
      onClick={(e) => {
        e.preventDefault();
        onSelectStore(store.storeUrl);
      }}
    >
      <div className="flex flex-1 items-center gap-x-3">
        <Image
          src={store.flagIcon}
          alt={t("flagAlt", { country: store.country })}
          width={24}
          height={24}
          unoptimized
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
            <span className="text-sm text-gray-500">({store.language})</span>
          </div>
        )}
      </div>
      <ArrowRightLine
        className="opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </Button>
  );
}
