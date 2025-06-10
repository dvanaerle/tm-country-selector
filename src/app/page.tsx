import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/header";
import heroImage from "/public/images/tuinmaximaal-verandas.jpg";
import StoreSelection from "@/components/home/StoreSelection";
import { StoresData } from "@/data/stores";
import { getStoreLocalization } from "@/lib/storeUtils";

export default function Home() {
  const t = useTranslations("Pages.Home");
  const locale = useLocale(); // Haalt de huidige taal/land-code op (bijv. 'nl').
  const userCountryCode = locale.toUpperCase();

  // Bepaalt de landselectie en de overige landen op basis van de locale van de gebruiker.
  const { preferredStore, otherStores } = getStoreLocalization(
    userCountryCode,
    StoresData,
  );

  return (
    <>
      <Header />
      <main
        className="container mx-auto px-4 py-12 sm:px-6 xl:h-[calc(100dvh-(--spacing(19)))] xl:py-20"
        role="main"
        aria-label={t("a11y.mainContentLabel")}
      >
        <section className="overflow-hidden rounded-lg bg-white xl:h-full">
          <div className="grid grid-cols-12 xl:h-full">
            {/* Sectie voor de afbeelding */}
            <div className="relative col-span-12 max-xl:aspect-16/9 xl:col-span-7">
              <Image
                src={heroImage}
                alt={t("a11y.heroImageAlt")}
                fill
                priority
                fetchPriority="high"
                placeholder="blur"
                className="object-cover object-[center_55%]"
                sizes="
                  (min-width: 1536px) calc((1536px - 48px) * 7/12),
                  (min-width: 1280px) calc((1280px - 48px) * 7/12),
                  (min-width: 1024px) calc(1024px - 48px),
                  (min-width: 768px) calc(768px - 48px),
                  (min-width: 640px) calc(640px - 48px),
                  calc(100vw - 32px)"
              />
            </div>

            {/* Sectie voor de landselectie */}
            <StoreSelection
              preferredStore={preferredStore}
              otherStores={otherStores}
            />
          </div>
        </section>
      </main>
    </>
  );
}
