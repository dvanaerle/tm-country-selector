import { type StoreData } from "@/data/stores";

export function getStoreLocalization(
  userCountryCode: string,
  allStores: StoreData[],
) {
  const preferredStore = allStores.find(
    (store) => store.countryCode === userCountryCode,
  );
  const otherStores = allStores.filter(
    (store) => store.countryCode !== userCountryCode,
  );
  return { preferredStore, otherStores };
}
