"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LangModeSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const locales = ["en", "ar"];
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    // Detect current locale from URL
    const loc = locales.find((l) => pathname.startsWith(`/${l}`));
    setCurrentLocale(loc || "en");
  }, [pathname]);

  const switchLanguage = () => {
    const newLocale = currentLocale === "en" ? "ar" : "en";

    // Remove existing locale prefix
    let pathWithoutLocale = pathname;
    locales.forEach((loc) => {
      if (pathWithoutLocale.startsWith(`/${loc}`)) {
        pathWithoutLocale = pathWithoutLocale.replace(`/${loc}`, "") || "/";
      }
    });

    // Add the new locale prefix
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // Optionally save in cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;

    // Navigate
    // router.push(newPath);
    // Full reload
    window.location.href = newPath;
  };

  return (
    <button onClick={switchLanguage} style={{ fontSize: "18px" }}>
      {currentLocale === "en" ? "🇪🇬 AR" : "🇺🇸 EN"}
    </button>
  );
}
