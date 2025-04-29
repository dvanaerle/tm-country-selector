"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ArrowRightLine from "/public/icons/arrow_right_line.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type StoreData = {
  countryCode: string;
  country: string;
  language: string;
  storeUrl: string;
  flagIcon: string;
};

function StoreCard({
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

function MainContent({
  preferredStore,
  otherStores,
  saveSelection,
  setSaveSelection,
  handleSelectStore,
}: {
  preferredStore: StoreData | undefined;
  otherStores: StoreData[];
  saveSelection: boolean;
  setSaveSelection: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectStore: (storeUrl: string) => void;
}) {
  const t = useTranslations("Home");

  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 xl:h-[calc(100dvh-(--spacing(19)))] xl:p-20">
      <section className="overflow-hidden rounded-lg p-4 max-xl:bg-white sm:p-6 xl:h-full xl:p-0">
        <div className="grid grid-cols-12 gap-y-5 xl:h-full">
          <div className="relative col-span-12 max-xl:aspect-[2/1] xl:col-span-7">
            <Image
              src="/tuinmaximaal-verandas.jpg"
              alt={t("heroImageAlt", { storeName: t("storeName") })}
              fill
              priority
              className="rounded object-cover xl:rounded-none"
              sizes="(max-width: 1279px) 100vw, (min-width: 1280px) 50vw"
            />
          </div>
          <div className="no-scrollbar col-span-12 overflow-y-auto sm:bg-white xl:col-span-5 xl:p-20">
            {preferredStore && (
              <>
                <h1 className="mb-5 text-2xl font-extrabold">
                  {t("selectCountry")}
                </h1>
                <div className="mb-8">
                  <p className="text-neutral-grey mb-2 text-sm font-bold">
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
                <p className="text-neutral-grey mb-2 text-sm font-bold">
                  {t("otherCountryPreference")}
                </p>
              </>
            )}

            <ul className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(min(272px,100%),1fr))] gap-3">
              {otherStores.map((store) => (
                <li key={store.countryCode}>
                  <StoreCard store={store} onSelectStore={handleSelectStore} />
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-3">
              <Checkbox
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

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const router = useRouter();
  const [saveSelection, setSaveSelection] = useState(false);
  const stores = t.raw("stores") as StoreData[];
  const userCountryCode = locale.toUpperCase();
  const preferredStore = stores.find(
    (store) => store.countryCode === userCountryCode,
  );
  const otherStores = stores.filter(
    (store) => store.countryCode !== userCountryCode,
  );
  const handleSelectStore = (storeUrl: string) => {
    if (saveSelection) {
      document.cookie = `preferredStore=${encodeURIComponent(storeUrl)}; path=/; max-age=31536000`; // 1 year
    }
    router.push(storeUrl);
  };

  return (
    <>
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
