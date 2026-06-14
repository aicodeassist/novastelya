import { ReactNode } from "react";
import { Header, Footer, CityBanner, CookieConsent } from "@/components/layout";
import { getCityBySlug } from "@/config/geo-matrix";
import { SchemaScript, buildLocalBusinessSchema } from "@/seo";
import settings from "@/config/settings.json";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string; city?: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale, city: rawCity } = await params;
  
  // Валидируем локаль (если rawLocale — не "ru", сбрасываем в "uk")
  const locale = rawLocale === "ru" ? "ru" : "uk";
  
  // Вычисляем город на сервере с учетом возможного смещения города в параметр locale
  const currentCity = getCityBySlug(rawCity) || getCityBySlug(rawLocale);
  
  // LocalBusiness schema for the specific city context
  const localBusinessSchema = currentCity
    ? buildLocalBusinessSchema(currentCity, locale)
    : null;

  const showCookieConsent = (settings as any).features?.cookieConsent !== false;

  return (
    <>
      {localBusinessSchema && <SchemaScript schema={localBusinessSchema} />}
      <Header currentCity={currentCity} locale={locale} />
      <CityBanner locale={locale} />
      <main id="main-content">{children}</main>
      <Footer currentCity={currentCity} locale={locale} />
      {showCookieConsent && <CookieConsent locale={locale} />}
    </>
  );
}
