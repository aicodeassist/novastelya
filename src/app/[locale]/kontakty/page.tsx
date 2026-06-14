import React from "react";
import { Metadata } from "next";
import { generatePageMetadata } from "@/seo";
import { ContactsPageTemplate } from "@/components/templates/ContactsPageTemplate";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    page: "contacts",
    locale: locale as "uk" | "ru",
  });
}

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  return <ContactsPageTemplate locale={locale as "uk" | "ru"} />;
}
