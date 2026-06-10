import { FaqPageTemplate, getFaqMetadataGenerator } from "@/components/templates/FaqPageTemplate";

export const generateMetadata = getFaqMetadataGenerator();

export default function Page({ params }: { params: any }) {
  return <FaqPageTemplate params={params} />;
}
