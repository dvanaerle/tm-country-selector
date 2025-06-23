// Definieert de datastructuur voor een enkele store.
export type StoreData = {
  // De unieke code voor het land en de taal (bijv. "BE-NL", "DE").
  countryCode: string;
  // De naam van het land.
  country: string;
  // De taal die in het land wordt gesproken.
  language: string;
  // De volledige URL naar de webshop.
  storeUrl: string;
};

// Een array met de data van alle beschikbare stores.
export const STORES_DATA: StoreData[] = [
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
