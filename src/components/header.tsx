import Link from "next/link";
import Logo from "../../public/brand/tm-logo.svg";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Components.Header");

  return (
    <header className="bg-primary h-19" role="banner">
      <nav role="navigation" aria-label={t("a11y.mainNavigation")}>
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            href="/"
            aria-label={t("a11y.logoAriaLabel")}
            className="group relative"
          >
            <div className="bg-primary border-primary-shadow group-focus-visible:ring-ring/50 absolute top-0 z-10 rounded-b-sm border-x-2 border-b-2 px-6 pt-4 pb-6 group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:outline-none">
              <Logo width={96} height={61} aria-hidden="true" role="img" />
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
