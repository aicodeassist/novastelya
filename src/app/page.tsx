import HomePage, { generateMetadata as homeMetadata } from "./[locale]/page";
import { Header, Footer, CityBanner, CookieConsent } from "@/components/layout";
import settings from "@/config/settings.json";

export async function generateMetadata() {
  return homeMetadata({ params: Promise.resolve({ locale: "uk" }) });
}

export default async function RootPage() {
  const params = Promise.resolve({ locale: "uk" as const });
  const showCookieConsent = (settings as any).features?.cookieConsent !== false;

  return (
    <>
      <CityBanner locale="uk" />
      <Header currentCity={null} locale="uk" />
      <main id="main-content">
        <HomePage params={params} />
      </main>
      <Footer currentCity={null} locale="uk" />
      {showCookieConsent && <CookieConsent locale="uk" />}
    </>
  );}
