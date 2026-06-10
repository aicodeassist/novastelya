import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { generatePageMetadata } from "@/seo/metadata/generate-page-metadata";
import { getCityBySlug } from "@/config/geo-matrix";
import { buildPath } from "@/seo/urls/build-path";
import { buildHreflangAlternates } from "@/seo/alternates/build-hreflang";
import { getPageSchema } from "@/seo/schema/page-schemas";
import { services } from "@/config/services.config";
import { getCityPhrase } from "@/seo/content/city-copy";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  if (!token) return false;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const payload = await verifyToken(token, adminPassword);
  return !!payload;
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "home";
    const locale = (searchParams.get("locale") as any) || "uk";
    const citySlug = searchParams.get("city") || "";

    const cityConfig = citySlug ? getCityBySlug(citySlug) : null;

    const meta = await generatePageMetadata({
      page: page as any,
      city: cityConfig,
      locale: locale,
    });

    const alternates = buildHreflangAlternates(page as any, citySlug || undefined);
    const canonical = `${meta.metadataBase}${buildPath(page as any, locale, citySlug || undefined)}`;

    // Build sample Schema contexts
    let schemaObj: any = {};
    try {
      const serviceConfig = services.find((s) => s.slug === page) || null;
      schemaObj = getPageSchema({
        pageType: serviceConfig ? (citySlug ? "city-service" : "service") : (citySlug ? "city" : "home"),
        city: cityConfig,
        service: serviceConfig,
      });
    } catch (e) {
      schemaObj = { info: "Schema build skipped or error occurred" };
    }

    // H1 text estimation
    let h1Text = "Натяжні стелі";
    const phrase = cityConfig ? getCityPhrase(cityConfig.slug, locale) : "";
    if (page === "home") {
      h1Text = cityConfig ? `Натяжні стелі ${phrase || `в м. ${cityConfig.uk}`}` : "Натяжні стелі в Україні";
    } else {
      const serviceConfig = services.find((s) => s.slug === page);
      if (serviceConfig) {
        h1Text = cityConfig ? `${serviceConfig.uk.title} ${phrase || `в м. ${cityConfig.uk}`}` : serviceConfig.uk.title;
      }
    }

    return NextResponse.json({
      title: meta.title,
      description: meta.description,
      canonical,
      hreflangs: alternates,
      schema: schemaObj,
      h1Text,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate metadata" }, { status: 500 });
  }
}
