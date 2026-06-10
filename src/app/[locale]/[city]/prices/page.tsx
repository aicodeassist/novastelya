import { PricesPageTemplate, getPricesMetadataGenerator } from "@/components/templates/PricesPageTemplate";
import { activeCities } from "@/config/geo-matrix";
import { notFound } from "next/navigation";
import { getCityBySlug } from "@/config/geo-matrix";

export const generateMetadata = getPricesMetadataGenerator();

export function generateStaticParams() {
  const locales = ["uk", "ru"];
  return locales.flatMap((locale) =>
    activeCities.map((city) => ({
      locale,
      city: city.slug,
    }))
  );
}

export default async function Page({ params }: { params: Promise<{ locale: string; city: string }> }) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.city);
  
  if (!city || !city.active) {
    notFound();
  }

  return <PricesPageTemplate params={params} />;
}
