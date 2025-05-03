import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/header";
import heroImage from "../../public/images/home/tuinmaximaal-verandas.jpg";
import StoreSelection from "@/components/home/StoreSelection";
import { type StoreData } from "@/components/home/StoreCard";

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const stores = t.raw("stores") as StoreData[];
  const userCountryCode = locale.toUpperCase();

  // This filtering happens on the server
  const preferredStore = stores.find(
    (store) => store.countryCode === userCountryCode,
  );
  const otherStores = stores.filter(
    (store) => store.countryCode !== userCountryCode,
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
                alt={t("heroImageAlt")}
                fill
                priority
                fetchPriority="high"
                className="rounded object-cover xl:rounded-none"
                sizes="(min-width: 2080px) calc(51.63vw - 218px), (min-width: 1540px) calc(8.27vw + 676px), (min-width: 1280px) 653px, (min-width: 1040px) 928px, (min-width: 780px) 672px, (min-width: 640px) 544px, calc(100vw - 64px)"
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
