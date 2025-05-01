import Link from "next/link";
import Logo from "@/components/logo";

import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Header");

  return (
    <header className="bg-primary-green h-19">
      <Link href="/" aria-label={t("logoAriaLabel")}>
        <div className="container mx-auto px-4 sm:px-6 xl:px-20">
          <div className="bg-primary-green border-primary-dark-green absolute top-0 z-10 rounded-br rounded-bl border-t-0 border-r-2 border-b-2 border-l-2 px-6 pt-4 pb-6">
            <Logo width={96} height="100%" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </header>
  );
}
