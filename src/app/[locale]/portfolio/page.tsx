import { PortfolioPageTemplate, getPortfolioMetadataGenerator } from "@/components/templates/PortfolioPageTemplate";

export const generateMetadata = getPortfolioMetadataGenerator();

export default function Page({ params }: { params: any }) {
  return <PortfolioPageTemplate params={params} />;
}
