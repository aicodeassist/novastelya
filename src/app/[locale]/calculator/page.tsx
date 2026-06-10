import { CalculatorPageTemplate, getCalculatorMetadataGenerator } from "@/components/templates/CalculatorPageTemplate";

export const generateMetadata = getCalculatorMetadataGenerator();

export default function Page({ params }: { params: any }) {
  return <CalculatorPageTemplate params={params} />;
}
