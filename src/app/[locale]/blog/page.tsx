import React from "react";
import { Metadata } from "next";
import { generatePageMetadata } from "@/seo";
import { BlogPageTemplate } from "@/components/templates/BlogPageTemplate";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    page: "blog",
    locale: locale as "uk" | "ru",
  });
}

import { blogArticles } from "@/config/blog.config";


export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  return <BlogPageTemplate locale={locale as "uk" | "ru"} />;
}
