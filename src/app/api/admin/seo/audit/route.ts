import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { generatePageMetadata } from "@/seo/metadata/generate-page-metadata";
import { getPageSchema } from "@/seo/schema/page-schemas";
import { runDeepSeoAudit } from "@/seo/audit/rules";
import { buildPath } from "@/seo/urls/build-path";
import { activeCities } from "@/config/geo-matrix";
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

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results: any[] = [];
    let okCount = 0;
    let warnCount = 0;
    let errorCount = 0;

    const testCases: any[] = [];

    // Static pages
    const staticPages = ["home", "prices", "faq", "portfolio", "blog", "contacts", "about"];
    const locales: Array<"uk" | "ru"> = ["uk", "ru"];

    locales.forEach((loc) => {
      staticPages.forEach((pg) => {
        testCases.push({ page: pg, city: null, locale: loc });
      });
    });

    // City hubs
    locales.forEach((loc) => {
      activeCities.forEach((city) => {
        testCases.push({ page: "home", city, locale: loc });
      });
    });

    // City subpages
    const citySubPages = ["prices", "portfolio", "faq", "contacts"];
    locales.forEach((loc) => {
      activeCities.forEach((city) => {
        citySubPages.forEach((pg) => {
          testCases.push({ page: pg, city, locale: loc });
        });
      });
    });

    // Services & City services
    locales.forEach((loc) => {
      services.forEach((service) => {
        testCases.push({ page: service.slug, city: null, locale: loc });
        activeCities.forEach((city) => {
          testCases.push({ page: service.slug, city, locale: loc });
        });
      });
    });

    for (const tc of testCases) {
      const meta = await generatePageMetadata({
        page: tc.page,
        city: tc.city,
        locale: tc.locale,
      });

      const title = (meta.title as string) || "";
      const desc = (meta.description as string) || "";
      const urlPath = buildPath(tc.page, tc.locale, tc.city?.slug);

      // Estimate H1
      let h1Text = "Натяжні стелі";
      const phrase = tc.city ? getCityPhrase(tc.city.slug, tc.locale) : "";
      if (tc.page === "home") {
        h1Text = tc.city ? `Натяжні стелі ${phrase || `в м. ${tc.city.uk}`}` : "Натяжні стелі в Україні";
      } else {
        const serviceConfig = services.find(s => s.slug === tc.page);
        if (serviceConfig) {
          h1Text = tc.city ? `${serviceConfig.uk.title} ${phrase || `в м. ${tc.city.uk}`}` : serviceConfig.uk.title;
        }
      }

      // Load mock schema
      let schemaObj: any = {};
      try {
        const serviceConfig = services.find(s => s.slug === tc.page) || null;
        schemaObj = getPageSchema({
          pageType: serviceConfig ? (tc.city ? "city-service" : "service") : (tc.city ? "city" : "home"),
          city: tc.city,
          service: serviceConfig,
        });
      } catch (e) {
        schemaObj = null;
      }

      // Run advanced audit
      const audit = runDeepSeoAudit({
        title,
        description: desc,
        h1: h1Text,
        schema: schemaObj,
      });

      if (audit.status === "OK") okCount++;
      else if (audit.status === "WARNING") warnCount++;
      else errorCount++;

      results.push({
        id: `${tc.locale}-${tc.city?.slug || "national"}-${tc.page}`,
        locale: tc.locale,
        city: tc.city?.uk || "Національна",
        page: tc.page,
        url: urlPath,
        title,
        desc,
        status: audit.status,
        score: audit.score,
        issues: audit.issues.join(", ") || "None",
      });
    }

    return NextResponse.json({
      summary: { ok: okCount, warn: warnCount, error: errorCount },
      results,
    });
  } catch (e) {
    return NextResponse.json({ error: "Bulk audit failed" }, { status: 500 });
  }
}
