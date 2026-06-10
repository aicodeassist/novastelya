import { PricesPageTemplate, getPricesMetadataGenerator } from "@/components/templates/PricesPageTemplate";

export const generateMetadata = getPricesMetadataGenerator();

export default function Page({ params }: { params: any }) {
  return <PricesPageTemplate params={params} />;
}
