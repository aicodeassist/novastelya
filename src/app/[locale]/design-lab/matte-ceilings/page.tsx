import { DesignLabService } from "../_components/DesignLabService";

export const metadata = {
  title: "Matte Ceilings — Design Lab Variant",
  description: "Matte stretch ceilings design showcase using advanced 2026 CSS features.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MatteCeilingsDesignLabPage({ params }: { params: any }) {
  return <DesignLabService params={params} />;
}
