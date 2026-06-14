import { ServicePageTemplate, getMetadataGenerator } from "@/components/templates/ServicePageTemplate";

const slug = "konturne-pidsvichuvannya";
export const generateMetadata = getMetadataGenerator(slug);

export default function Page({ params }: { params: any }) {
  return <ServicePageTemplate serviceSlug={slug} params={params} />;
}
