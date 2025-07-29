# Tuinmaximaal Country Selector

This project is a responsive, internationalized landing page for Tuinmaximaal. It's designed to welcome users and guide them to the correct regional online store based on their browser's language settings, providing a seamless user experience from the very first visit.

## Overview

The application serves as a global entry point for Tuinmaximaal customers. It automatically detects the user's preferred language and suggests the corresponding country's store. Users can also manually select from a list of all available regional stores. The interface is clean, modern, and fully translated into English, Dutch, German, and French.

## ✨ Features

- **Automatic Locale Detection**: Intelligently detects the user's browser language (`Accept-Language` header) to suggest the most relevant store.
- **Preferred Store Suggestion**: Highlights the detected regional store for quick access.
- **Full Internationalization (i18n)**: All user-facing text is translated into 4 languages (EN, DE, FR, NL) using `next-intl`.
- **Responsive Design**: A mobile-first, fully responsive layout built with Tailwind CSS that looks great on all devices.
- **Modern Tech Stack**: Built with the latest web technologies including Next.js 15, React 19, and TypeScript.
- **Component-Based Architecture**: A clean and maintainable codebase with reusable UI components and a clear separation of concerns.
- **Accessibility Focused**: Semantic HTML and ARIA attributes are used to ensure the application is accessible to all users.

## 🛠️ Tech Stack

| Category                 | Technology                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Framework**            | [Next.js](https://nextjs.org/) 15 (with App Router)                                                      |
| **Language**             | [TypeScript](https://www.typescriptlang.org/)                                                            |
| **UI Library**           | [React](https://react.dev/) 19                                                                           |
| **Styling**              | [Tailwind CSS](https://tailwindcss.com/) 4.x                                                             |
| **Internationalization** | [next-intl](https://next-intl-docs.vercel.app/)                                                          |
| **Locale Matching**      | [Negotiator](https://github.com/jshttp/negotiator), [@formatjs/intl-localematcher](https://formatjs.io/) |
| **UI Components**        | [Radix UI (Slot)](https://www.radix-ui.com/primitives), [class-variance-authority](https://cva.style/)   |
| **Linting**              | [ESLint](https://eslint.org/)                                                                            |

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/dvanaerle/tm-country-selector.git
    cd tm-country-selector
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`. The page will automatically reload as you make changes to the code.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server (requires a build to be run first).
- `npm run lint`: Lints the codebase using ESLint to find and fix problems.

## 📂 Project Structure

The project follows a standard Next.js App Router structure with a focus on clear separation of concerns.

```
.
├── public/               # Static assets (images, fonts, icons)
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable React components
│   │   ├── home/         # Components specific to the homepage
│   │   └── ui/           # General-purpose UI components (e.g., Button)
│   ├── data/             # Static data, like store information (stores.ts)
│   ├── i18n/             # Internationalization configuration (request.ts)
│   └── lib/              # Utility functions (utils.ts, store-utils.ts)
├── messages/             # Translation files for next-intl (en.json, de.json, etc.)
└── ...                   # Configuration files (next.config.mjs, tailwind.config.ts, etc.)
```

## 💡 Key Implementation Details

### Internationalization (i18n)

The i18n setup is a core feature of this application, configured in `src/i18n/request.ts`.

- It uses `next-intl`'s server-side capabilities.
- On an incoming request, the `Accept-Language` header is parsed using `Negotiator`.
- `@formatjs/intl-localematcher` is used to find the best-supported locale (`en`, `nl`, `de`, `fr`) based on the user's preferences. English (`en`) is the default fallback.
- The appropriate message file from `/messages/{locale}.json` is then loaded for the request.
- The `useTranslations` hook from `next-intl` is used within components to access translated strings.

### Store Selection Logic

The main page (`src/app/page.tsx`) orchestrates the store selection logic.

1.  It gets the current locale determined by the i18n middleware.
2.  It attempts to match this locale to a `countryCode` in the `STORES_DATA` array from `src/data/stores.ts`.
3.  The `getStoreLocalization` utility function (`src/lib/store-utils.ts`) is used to separate the stores into a `preferredStore` (if a match was found) and `otherStores`.
4.  These two lists are passed as props to the `<StoreSelection />` component, which handles the rendering of the UI.
5.  When a user clicks a store card, `next/navigation`'s `useRouter` is used to redirect them to the selected store's URL.

### Styling

- **Tailwind CSS**: The project uses Tailwind CSS for utility-first styling. Custom theme values (colors, fonts, spacing) are defined in `src/app/globals.css` using the `@theme` directive.
- **`cn` Utility**: The `cn` function in `src/lib/utils.ts` is a helper that merges Tailwind classes from `clsx` and `tailwind-merge`, allowing for clean and conditional class name composition in components.
- **Custom Fonts**: The "Articulat CF" font is loaded locally from `/public/fonts` and configured in `src/app/layout.tsx` using `next/font/local`.

---
