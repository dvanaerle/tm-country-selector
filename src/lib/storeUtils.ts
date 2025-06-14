import { type StoreData } from "@/data/stores";

// Scheidt een lijst van landen in een 'voorkeursland' en 'overige landen'
// op basis van de landcode van de gebruiker.
export function getStoreLocalization(
  userCountryCode: string,
  allStores: StoreData[],
) {
  // Vind het land die overeenkomt met de landcode van de gebruiker.
  const preferredStore = allStores.find(
    (store) => store.countryCode === userCountryCode,
  );

  // Filter de lijst om alle andere landen te krijgen.
  const otherStores = allStores.filter(
    (store) => store.countryCode !== userCountryCode,
  );

  return { preferredStore, otherStores };
}
