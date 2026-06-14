import { ServicePageTemplate, getMetadataGenerator } from "@/components/templates/ServicePageTemplate";

const slug = "paryashchi-steli";
export const generateMetadata = getMetadataGenerator(slug);

export default function Page({ params }: { params: any }) {
  return <ServicePageTemplate serviceSlug={slug} params={params} />;
}
