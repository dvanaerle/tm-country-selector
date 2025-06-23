import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// De basis Next.js configuratie voor het project
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
  webpack(config) {
    // Vind de bestaande regel die SVG imports verwerkt
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Hergebruik de bestaande regel, maar alleen voor SVG imports die eindigen op ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Converteer alle andere *.svg imports naar React componenten
      // Dit maakt het mogelijk om SVG's als componenten te gebruiken in plaats van afbeeldingen
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Wijzig de file loader regel om *.svg te negeren, omdat we dit nu zelf afhandelen
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

// Wrap de configuratie met next-intl voor internationalisatie
export default withNextIntl(nextConfig);
