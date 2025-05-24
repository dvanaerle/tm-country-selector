"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StoreCard } from "./StoreCard";
import { type StoreData } from "@/data/stores";

export default function StoreSelection({
  preferredStore,
  otherStores,
}: {
  preferredStore: StoreData | undefined;
  otherStores: StoreData[];
}) {
  const t = useTranslations("Components.StoreSelection");
  const router = useRouter();
  const [saveSelection, setSaveSelection] = useState(false);

  const handleSelectStore = (storeUrl: string) => {
    if (saveSelection) {
      document.cookie = `preferredStore=${encodeURIComponent(storeUrl)}; path=/; max-age=31536000; Secure; SameSite=Strict`;
    }
    router.push(storeUrl);
  };

  return (
    <div className="no-scrollbar col-span-12 overflow-y-auto p-5 sm:p-10 xl:col-span-5 xl:p-12">
      {preferredStore && (
        <>
          <h1 className="mb-5 text-2xl font-bold">{t("selectCountry")}</h1>
          <div className="mb-6">
            <p className="text-neutral-grey mb-2 text-sm font-semibold">
              {t("areYouFrom", {
                country: preferredStore.country,
              })}
            </p>
            <StoreCard
              store={preferredStore}
              isPreferred={true}
              onSelectStore={handleSelectStore}
            />
          </div>
          <p className="text-neutral-grey mb-2 text-sm font-semibold">
            {t("otherCountryPreference")}
          </p>
        </>
      )}

      <ul className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(min(272px,100%),1fr))] gap-3">
        {otherStores.map((store) => (
          <li key={store.countryCode}>
            <StoreCard store={store} onSelectStore={handleSelectStore} />
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-3">
        <Checkbox
          name="savePreference"
          id="savePreference"
          checked={saveSelection}
          onCheckedChange={(checked) => setSaveSelection(checked === true)}
        />
        <Label className="cursor-pointer font-medium" htmlFor="savePreference">
          {t("saveSelection")}
        </Label>
      </div>
    </div>
  );
}
