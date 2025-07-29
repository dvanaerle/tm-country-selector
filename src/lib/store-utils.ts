import { type StoreData, type CountryCode } from "@/data/stores";

type GetStoreLocalizationOptions = {
  userCountryCode: CountryCode | undefined;
  allStores: StoreData[];
};

export function getStoreLocalization({
  userCountryCode,
  allStores,
}: GetStoreLocalizationOptions) {
  const preferredStore = userCountryCode
    ? allStores.find((store) => store.countryCode === userCountryCode)
    : undefined;

  const otherStores = allStores.filter(
    (store) => store.countryCode !== userCountryCode,
  );

  return { preferredStore, otherStores };
}
