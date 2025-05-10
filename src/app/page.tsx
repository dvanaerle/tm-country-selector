import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/header";
import heroImage from "/public/images/tuinmaximaal-verandas.jpg";
import StoreSelection from "@/components/home/StoreSelection";
import { StoresData } from "@/data/stores";
import { getStoreLocalization } from "@/lib/storeUtils";

export default function Home() {
  const t = useTranslations("Pages.Home");
  const locale = useLocale();
  const userCountryCode = locale.toUpperCase();

  // Use the utility function to get preferred and other stores
  const { preferredStore, otherStores } = getStoreLocalization(
    userCountryCode,
    StoresData,
  );

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 sm:px-6 xl:h-[calc(100dvh-(--spacing(19)))] xl:p-20">
        <section className="overflow-hidden rounded-lg p-4 max-xl:bg-white sm:p-6 xl:h-full xl:p-0">
          <div className="grid grid-cols-12 gap-y-5 xl:h-full">
            <div className="relative col-span-12 max-xl:aspect-[2/1] xl:col-span-7">
              <Image
                src={heroImage}
                alt={t("a11y.heroImageAlt")}
                fill
                priority
                fetchPriority="high"
                placeholder="blur"
                className="rounded object-cover xl:rounded-none"
                sizes="
                 (min-width: 1536px) calc((1536px - 160px) * 7/12),
                 (min-width: 1280px) calc((1280px - 160px) * 7/12),
                 (min-width: 1024px) calc(1024px - 96px),
                 (min-width: 768px) calc(768px - 96px),
                 (min-width: 640px) calc(640px - 96px),
                 calc(100vw - 64px)"
              />
            </div>

            {/* Store selection - interactive client component */}
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
