import { SITE_URL } from "@/seo/constants/site";

export function generateRobots() {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

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
            disallow: [
              "/api/",
              "/_next/",
              "/admin/",
              "/blog",
              "/faq",
              "/ru/blog",
              "/ru/faq",
            ],
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
