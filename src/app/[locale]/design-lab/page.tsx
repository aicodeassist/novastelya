import { DesignLabHome } from "./_components/DesignLabHome";

export const metadata = {
  title: "NOVA STELYA — Design Lab",
  description: "A showcase of world-class, state-of-the-art UI/UX design concepts using advanced CSS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignLabPage({ params }: { params: any }) {
  return <DesignLabHome params={params} />;
}
