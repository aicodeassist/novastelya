import { SITE_URL } from "@/seo/constants/site";

export function generateRobots() {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  if (!allowIndexing) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  const isProd = process.env.NODE_ENV === "production";

  return {
    rules: isProd
      ? [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/", "/admin/"],
          },
          {
            userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Googlebot"],
            allow: "/",
          },
        ]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
export { generateRobots as generate };
