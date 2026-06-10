import HomePage, { generateMetadata as homeMetadata } from "./[locale]/page";
import { Header, Footer, CityBanner, CookieConsent } from "@/components/layout";

export async function generateMetadata() {
  return homeMetadata({ params: Promise.resolve({ locale: "uk" }) });
}

export default async function RootPage() {
  const params = Promise.resolve({ locale: "uk" as const });
  return (
    <>
      <CityBanner locale="uk" />
      <Header currentCity={null} locale="uk" />
      <main id="main-content">
        <HomePage params={params} />
      </main>
      <Footer currentCity={null} locale="uk" />
      <CookieConsent locale="uk" />
    </>
  );
}
