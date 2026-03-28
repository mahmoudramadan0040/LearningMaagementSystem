"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { ReactNode, useEffect, useState } from "react";
import { Provider, useDispatch ,useSelector} from "react-redux";
import { store } from "../store";
import Loader from "@/components/common/Loader";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeModeProvider } from "@/theme/themeContext";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme/theme";
import { usePathname, useRouter } from "next/navigation";
import { locales, rtlLocales } from "../languages/i18n";
interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale?: string };
}>) {

  const router = useRouter();
  const pathname = usePathname();

  const [locale, setLocale] = useState<string | null>("");
  const [messages, setMessages] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [mode, setMode] = useState<"light" | "dark">("light");
  // 1️⃣ Determine locale from URL or default
  useEffect(() => {
    let detectedLocale = "en"; // default
    const pathLocale = pathname.split("/")[1]; // get first segment

    if (pathLocale && locales.includes(pathLocale as any)) {
      detectedLocale = pathLocale as (typeof locales)[number];
    } else {
      // optional: auto-redirect based on browser language
      const userLang = navigator.language.startsWith("ar") ? "ar" : "en";
      if (userLang !== "en") {
        router.replace(`/${userLang}${pathname}`);
        return;
      }
    }

    setLocale(detectedLocale);

    setLoading(false);
  }, [pathname]);

  // 2️⃣ Load messages dynamically
  useEffect(() => {
    async function loadMessages() {
      try {
        const imported = locale
          ? await import(`../languages/messages/${locale}.json`)
          : await import(`../languages/messages/${"en"}.json`);

        setMessages(imported.default);
        setLoading(false);
      } catch (err) {
        console.error("Could not load language file", err);
      }
    }

    loadMessages();
  }, [locale]);

  // 3️⃣ Don't render provider until locale and messages are ready
  // Add a fallback to an empty string or 'en'
  const dir = locale && rtlLocales.includes(locale) ? "rtl" : "ltr";
  
  return (
    <html lang={locale as any} dir={dir}>
      <body suppressHydrationWarning={true} className="dark:bg-[#1A222C] dark:text-bodydark">
        {locale && messages ? (
          <NextIntlClientProvider locale={locale as any} messages={messages} >
            <ThemeModeProvider>
            <CssBaseline />
            <Provider store={store}>
              <div className="dark:bg-[#1A222C] dark:text-bodydark">
                {loading ? <Loader /> : children}
              </div>
            </Provider>
            </ThemeModeProvider>
          </NextIntlClientProvider>
        ) : (
          <Loader />
        )}
      </body>
    </html>
  );
}
