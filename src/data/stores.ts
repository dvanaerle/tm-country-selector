export type StoreData = {
  countryCode: string;
  country: string;
  language: string;
  storeUrl: string;
};

export const StoresData: StoreData[] = [
  {
    countryCode: "BE-NL",
    country: "België",
    language: "Nederlands",
    storeUrl: "https://www.tuinmaximaal.be/",
  },
  {
    countryCode: "BE-FR",
    country: "Belgique",
    language: "Français",
    storeUrl: "https://www.tuinmaximaal.be/fr/",
  },
  {
    countryCode: "DE",
    country: "Deutschland",
    language: "Deutsch",
    storeUrl: "https://www.tuinmaximaal.de/",
  },
  {
    countryCode: "FR",
    country: "France",
    language: "Français",
    storeUrl: "https://www.tuinmaximaal.fr/",
  },
  {
    countryCode: "NL",
    country: "Nederland",
    language: "Nederlands",
    storeUrl: "https://www.tuinmaximaal.nl/",
  },
  {
    countryCode: "EN",
    country: "United Kingdom",
    language: "English",
    storeUrl: "https://www.tuinmaximaal.co.uk/",
  },
];
