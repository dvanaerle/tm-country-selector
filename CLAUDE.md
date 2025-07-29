# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for Tuinmaximaal (tm-com) built with TypeScript, using TailwindCSS for styling and next-intl for internationalization. The project supports 4 languages: English, Dutch, German, and French.

## Common Commands

### Development

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing

No test framework is currently configured in this project.

## Architecture & Structure

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS 4.x with PostCSS
- **Internationalization**: next-intl with automatic locale detection
- **Fonts**: Custom Articulat CF font family loaded locally

### Internationalization Setup

- Automatic locale detection via Accept-Language header using Negotiator
- Supported locales: en, nl, de, fr (default: en)
- Translation files in `/messages/{locale}.json`
- Locale matching via @formatjs/intl-localematcher
- Configuration in `src/i18n/request.ts`

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── home/           # Home page specific components
│   └── ui/             # Reusable UI components
├── data/               # Static data (stores, etc.)
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization config
└── lib/                # Utility functions
```

### SVG Handling

Custom webpack configuration in `next.config.mjs` allows:

- Default SVG imports as React components via @svgr/webpack
- SVG imports with `?url` suffix as file URLs
- Optimized image handling with WebP/AVIF formats

### Code Conventions

- **ESLint**: Uses Next.js config with custom rules
- **File naming**: kebab-case for files, PascalCase for components
- **Styling**: TailwindCSS classes, responsive design patterns
- **TypeScript**: Strict mode with comprehensive checks (noUnusedLocals, noImplicitReturns, etc.)
- **Validation**: Zod schemas for runtime type validation (stores, locales)
- **Path aliases**: `@/*` maps to `./src/*`

### Development Guidelines

- **TypeScript**: Strict mode, no `any` types or type assertions, schema-first development with Zod
- **Functional Programming**: Immutable data, pure functions, composition over inheritance
- **Error Handling**: Use Result types or early returns, avoid nested conditionals
- **Code Style**: No comments in code (self-documenting), prefer options objects over multiple parameters
- **File Naming**: kebab-case for all TypeScript files

## Key Implementation Details

### Layout & Metadata

- Dynamic metadata generation using next-intl translations
- Custom font loading from `/public/fonts/Articulat_CF/`
- Root layout handles locale detection and NextIntlClientProvider setup

### Store Management

- Store data in `src/data/stores.ts` with internationalized `countryKey` and `languageKey` properties
- Store utilities in `src/lib/store-utils.ts`
- Store selection components in `src/components/home/`
- Store translations in `messages/{locale}.json` under the `Stores` namespace

### Internationalization Implementation

- Hard-coded store display text has been replaced with translation keys
- Store data uses `countryKey` and `languageKey` instead of `country` and `language` properties
- All country names, language names, and formatting strings are properly internationalized
- Components use `useTranslations("Stores")` to access store-specific translations

## Development Notes

- Project uses newer Next.js 15 features and React 19
- TailwindCSS 4.x configuration
- Custom SVG handling allows flexible import strategies
- All hard-coded user-facing text has been internationalized
