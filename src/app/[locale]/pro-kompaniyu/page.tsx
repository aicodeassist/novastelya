import React from "react";
import { Metadata } from "next";
import { generatePageMetadata } from "@/seo";
import { AboutPageTemplate } from "@/components/templates/AboutPageTemplate";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    page: "about",
    locale: locale as "uk" | "ru",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  return <AboutPageTemplate locale={locale as "uk" | "ru"} />;
}
