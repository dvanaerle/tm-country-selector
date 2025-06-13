"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StoreCard } from "./StoreCard";
import { type StoreData } from "@/data/stores";

interface StoreSelectionProps {
  /** De gedetecteerde voorkeurselectie van de gebruiker, indien aanwezig. */
  preferredStore: StoreData | undefined;
  /** Een lijst met alle andere beschikbare landen. */
  otherStores: StoreData[];
}

/**
 * Rendert de UI voor het selecteren van een land, beheert de laadstatus
 * en de navigatie inclusief het opslaan van de keuze in een cookie.
 */
export default function StoreSelection({
  preferredStore,
  otherStores,
}: StoreSelectionProps) {
  const t = useTranslations("Components.StoreSelection");
  const router = useRouter();
  const [saveSelection, setSaveSelection] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLoading = isPending; // Gebruik `isPending` voor een betere UX bij navigatie.

  /**
   * Behandelt de selectie van een winkel.
   * Slaat de voorkeur op in een cookie indien aangevinkt en navigeert naar de URL.
   */
  const handleSelectStore = (storeUrl: string) => {
    startTransition(() => {
      try {
        if (saveSelection) {
          // Cookie instellen om de keuze 365 dagen te onthouden.
          document.cookie = `preferredStore=${encodeURIComponent(
            storeUrl,
          )}; path=/; max-age=31536000; Secure; SameSite=Strict`;
        }
        router.push(storeUrl);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div
      className="no-scrollbar col-span-12 overflow-y-auto p-5 sm:p-10 xl:col-span-5 xl:p-12"
      role="region"
      aria-label={t("selectCountry")}
    >
      {preferredStore && (
        <>
          <h1 className="mb-5 text-2xl font-bold">{t("selectCountry")}</h1>
          <div className="mb-6">
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              {t("areYouFrom", { country: preferredStore.country })}
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
        className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(min(278px,100%),1fr))] gap-3"
        role="list"
        aria-label={
          otherStores.length > 0 ? t("otherCountryPreference") : undefined
        }
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

      <div className="flex items-center gap-x-3">
        <Checkbox
          name="savePreference"
          id="savePreference"
          checked={saveSelection}
          onCheckedChange={(checked) => setSaveSelection(checked === true)}
          disabled={isLoading}
        />
        <Label className="cursor-pointer font-medium" htmlFor="savePreference">
          {t("saveSelection")}
        </Label>
      </div>
    </div>
  );
}
