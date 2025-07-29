"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { type StoreData } from "@/data/stores";

import { StoreCard } from "./store-card";

type StoreSelectionProps = {
  preferredStore: StoreData | undefined;
  otherStores: StoreData[];
};

export default function StoreSelection({
  preferredStore,
  otherStores,
}: StoreSelectionProps) {
  const t = useTranslations("Components.StoreSelection");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isLoading = isPending;

  const handleSelectStore = (storeUrl: string) => {
    startTransition(() => {
      router.push(storeUrl);
    });
  };

  return (
    <div
      className="no-scrollbar col-span-12 overflow-y-auto p-5 xl:col-span-5 xl:p-10"
      role="region"
      aria-label={t("selectCountry")}
    >
      {preferredStore && (
        <>
          <h1 className="mb-5 text-2xl font-bold">{t("selectCountry")}</h1>
          <div className="mb-6">
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              {t("areYouFrom", { country: preferredStore.countryKey })}
            </p>
            <StoreCard
              store={preferredStore}
              isPreferred={true}
              onSelectStore={handleSelectStore}
              disabled={isLoading}
            />
          </div>
          <p className="text-muted-foreground mb-2 text-sm font-semibold">
            {t("otherCountryPreference")}
          </p>
        </>
      )}

      <ul
        className="grid grid-cols-[repeat(auto-fit,minmax(min(278px,100%),1fr))] gap-2"
        role="list"
      >
        {otherStores.map((store) => (
          <li key={store.countryCode} role="listitem">
            <StoreCard
              store={store}
              onSelectStore={handleSelectStore}
              disabled={isLoading}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
