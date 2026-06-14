import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Link", value: "<https://res.cloudinary.com>; rel=preconnect" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Static pages mapping
      { source: "/about", destination: "/pro-kompaniyu", permanent: true },
      { source: "/contacts", destination: "/kontakty", permanent: true },
      { source: "/prices", destination: "/ciny", permanent: true },
      
      // Russian static pages mapping
      { source: "/ru/about", destination: "/ru/pro-kompaniyu", permanent: true },
      { source: "/ru/contacts", destination: "/ru/kontakty", permanent: true },
      { source: "/ru/prices", destination: "/ru/ciny", permanent: true },

      // Service pages mapping
      { source: "/matte-ceilings", destination: "/matovi-steli", permanent: true },
      { source: "/glossy-ceilings", destination: "/glyancevi-steli", permanent: true },
      { source: "/satin-ceilings", destination: "/satynovi-steli", permanent: true },
      { source: "/fabric-ceilings", destination: "/tkanynni-steli", permanent: true },
      { source: "/shadow-ceilings", destination: "/tinovi-steli", permanent: true },
      { source: "/floating-ceilings", destination: "/paryashchi-steli", permanent: true },
      { source: "/slotted-ceilings", destination: "/nishevi-steli", permanent: true },
      { source: "/carved-ceilings", destination: "/rizbleni-steli", permanent: true },
      { source: "/double-level-ceilings", destination: "/dvorivnevi-steli", permanent: true },
      { source: "/light-lines", destination: "/svitlovi-liniyi", permanent: true },
      { source: "/track-lighting", destination: "/trekove-svitlo", permanent: true },
      { source: "/backlight", destination: "/konturne-pidsvichuvannya", permanent: true },
      { source: "/starry-sky", destination: "/zoryane-nebo", permanent: true },
      { source: "/kitchen-ceilings", destination: "/kukhnya", permanent: true },
      { source: "/bathroom-ceilings", destination: "/vanna-kimnata", permanent: true },
      { source: "/bedroom-ceilings", destination: "/spalnya", permanent: true },
      { source: "/living-room-ceilings", destination: "/vitalnya", permanent: true },
      { source: "/childrens-room-ceilings", destination: "/dytyacha", permanent: true },
      { source: "/office-ceilings", destination: "/ofis", permanent: true },

      // Russian service pages mapping
      { source: "/ru/matte-ceilings", destination: "/ru/matovi-steli", permanent: true },
      { source: "/ru/glossy-ceilings", destination: "/ru/glyancevi-steli", permanent: true },
      { source: "/ru/satin-ceilings", destination: "/ru/satynovi-steli", permanent: true },
      { source: "/ru/fabric-ceilings", destination: "/ru/tkanynni-steli", permanent: true },
      { source: "/ru/shadow-ceilings", destination: "/ru/tinovi-steli", permanent: true },
      { source: "/ru/floating-ceilings", destination: "/ru/paryashchi-steli", permanent: true },
      { source: "/ru/slotted-ceilings", destination: "/ru/nishevi-steli", permanent: true },
      { source: "/ru/carved-ceilings", destination: "/ru/rizbleni-steli", permanent: true },
      { source: "/ru/double-level-ceilings", destination: "/ru/dvorivnevi-steli", permanent: true },
      { source: "/ru/light-lines", destination: "/ru/svitlovi-liniyi", permanent: true },
      { source: "/ru/track-lighting", destination: "/ru/trekove-svitlo", permanent: true },
      { source: "/ru/backlight", destination: "/ru/konturne-pidsvichuvannya", permanent: true },
      { source: "/ru/starry-sky", destination: "/ru/zoryane-nebo", permanent: true },
      { source: "/ru/kitchen-ceilings", destination: "/ru/kukhnya", permanent: true },
      { source: "/ru/bathroom-ceilings", destination: "/ru/vanna-kimnata", permanent: true },
      { source: "/ru/bedroom-ceilings", destination: "/ru/spalnya", permanent: true },
      { source: "/ru/living-room-ceilings", destination: "/ru/vitalnya", permanent: true },
      { source: "/ru/childrens-room-ceilings", destination: "/ru/dytyacha", permanent: true },
      { source: "/ru/office-ceilings", destination: "/ru/ofis", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
