"use client";

// Importing necessary hooks and components from Next.js and the application.
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ArrowRightLine from "@/components/icons/arrow_right_line";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/images/home/tuinmaximaal-verandas.jpg";

// Type definition for store data.
type StoreData = {
  countryCode: string; // ISO country code (e.g., "US", "NL").
  country: string; // Full country name (e.g., "United States").
  language: string; // Language spoken in the store's region.
  storeUrl: string; // URL of the store.
  flagIcon: string; // Path to the flag icon for the country.
};

// Component to display a single store card.
function StoreCard({
  store,
  isPreferred = false,
  onSelectStore,
}: {
  store: StoreData;
  isPreferred?: boolean; // Indicates if this is the preferred store.
  onSelectStore: (storeUrl: string) => void; // Callback when the store is selected.
}) {
  const t = useTranslations("Home"); // Hook to fetch translations for the "Home" namespace.

  return (
    <Button
      variant="outlineLight"
      size="md"
      fullWidth={true}
      className="group"
      onClick={(e) => {
        e.preventDefault(); // Prevent default button behavior.
        onSelectStore(store.storeUrl); // Trigger the callback with the store URL.
      }}
    >
      <div className="flex flex-1 items-center gap-x-3">
        {/* Display the flag icon for the store's country. */}
        <Image
          src={store.flagIcon}
          alt={t("flagAlt", { country: store.country })}
          width={24}
          height={24}
          unoptimized // Disable image optimization for svg files.
        />
        {isPreferred ? (
          // If this is the preferred store, display a special label.
          <span className="text-primary-dark-green text-left">
            {t("goToStore")}
          </span>
        ) : (
          // Otherwise, display the country and language.
          <div className="flex flex-wrap items-center gap-x-1">
            <span className="text-primary-dark-green text-left">
              {store.country}
            </span>
            <span className="text-sm text-gray-500">({store.language})</span>
          </div>
        )}
      </div>
      {/* Display an arrow icon that becomes visible on hover. */}
      <ArrowRightLine
        className="opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </Button>
  );
}

// Component to display the main content of the page.
function MainContent({
  preferredStore,
  otherStores,
  saveSelection,
  setSaveSelection,
  handleSelectStore,
}: {
  preferredStore: StoreData | undefined; // The user's preferred store, if available.
  otherStores: StoreData[]; // List of other available stores.
  saveSelection: boolean; // Whether to save the user's store selection.
  setSaveSelection: React.Dispatch<React.SetStateAction<boolean>>; // Function to update the saveSelection state.
  handleSelectStore: (storeUrl: string) => void; // Callback when a store is selected.
}) {
  const t = useTranslations("Home"); // Hook to fetch translations for the "Home" namespace.

  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 xl:h-[calc(100dvh-(--spacing(19)))] xl:p-20">
      <section className="overflow-hidden rounded-lg p-4 max-xl:bg-white sm:p-6 xl:h-full xl:p-0">
        <div className="grid grid-cols-12 gap-y-5 xl:h-full">
          {/* Display a hero image on the left side. */}
          <div className="relative col-span-12 max-xl:aspect-[2/1] xl:col-span-7">
            <Image
              src={heroImage} // Use the imported image object
              alt={t("heroImageAlt", { storeName: t("storeName") })}
              fill
              priority
              placeholder="blur"
              className="rounded object-cover xl:rounded-none"
              sizes="(max-width: 639px) calc(100vw - 4rem), (max-width: 1279px) calc(100vw - 6rem), 50vw"
            />
          </div>
          {/* Display the store selection options on the right side. */}
          <div className="no-scrollbar col-span-12 overflow-y-auto sm:bg-white xl:col-span-5 xl:p-12">
            {preferredStore && (
              <>
                <h1 className="mb-5 text-2xl font-bold">
                  {t("selectCountry")}
                </h1>
                <div className="mb-6">
                  <p className="text-neutral-grey mb-2 text-sm font-semibold">
                    {t("areYouFrom", {
                      country: preferredStore.country,
                    })}
                  </p>
                  {/* Display the preferred store card. */}
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

            {/* Display a list of other available stores. */}
            <ul className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(min(272px,100%),1fr))] gap-3">
              {otherStores.map((store) => (
                <li key={store.countryCode}>
                  <StoreCard store={store} onSelectStore={handleSelectStore} />
                </li>
              ))}
            </ul>

            {/* Checkbox to allow the user to save their store selection. */}
            <div className="flex items-center space-x-3">
              <Checkbox
                name="savePreference"
                id="savePreference"
                checked={saveSelection}
                onCheckedChange={(checked) =>
                  setSaveSelection(checked === true)
                }
              />
              <Label htmlFor="savePreference">{t("saveSelection")}</Label>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Main page component for the home page.
export default function Home() {
  const t = useTranslations("Home"); // Hook to fetch translations for the "Home" namespace.
  const locale = useLocale(); // Hook to get the current locale.
  const router = useRouter(); // Hook to navigate between pages.
  const [saveSelection, setSaveSelection] = useState(false); // State to track if the user wants to save their selection.
  const stores = t.raw("stores") as StoreData[]; // Fetch the list of stores from translations.
  const userCountryCode = locale.toUpperCase(); // Convert the locale to uppercase to match country codes.
  const preferredStore = stores.find(
    (store) => store.countryCode === userCountryCode, // Find the store matching the user's country code.
  );
  const otherStores = stores.filter(
    (store) => store.countryCode !== userCountryCode, // Filter out stores that don't match the user's country code.
  );

  // Function to handle store selection.
  const handleSelectStore = (storeUrl: string) => {
    if (saveSelection) {
      // Save the selected store URL in a cookie if the user opted to save their selection.
      document.cookie = `preferredStore=${encodeURIComponent(storeUrl)}; path=/; max-age=31536000; Secure; SameSite=Strict`; // 1 year
    }
    router.push(storeUrl); // Navigate to the selected store's URL.
  };

  return (
    <>
      {/* Render the header and main content components. */}
      <Header />
      <MainContent
        preferredStore={preferredStore}
        otherStores={otherStores}
        saveSelection={saveSelection}
        setSaveSelection={setSaveSelection}
        handleSelectStore={handleSelectStore}
      />
    </>
  );
}
