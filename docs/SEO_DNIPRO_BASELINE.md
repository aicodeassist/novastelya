# NOVA STELYA — canonical SEO metadata for Dnipro

The single source of truth for the existing Dnipro market is `src/seo/content/dnipro-seo-baseline.json`, covering `title`, `description`, and `h1` in Ukrainian and Russian. Preserve these values when replacing the website implementation. Do not regenerate them from generic city-service templates. Preserve the domain `https://novastelya.com` and map unchanged URLs to the new router. Add redirect rules for paths that must move.

This baseline applies to Dnipro only. Other cities need separately verified localized content. The blog entry is for the blog listing only, not for articles. H1 and Title share intent but need not be identical.

Treat changes as editorial decisions: revise only after verifying real services, page content, and Google Search Console evidence. Google may rewrite the displayed search title or snippet.

## Content verification gate before requesting indexing

- Verify that the home title's installation-in-one-day claim is supported by actual service conditions.
- Replace mock portfolio projects and image placeholders with documented work or exclude unfinished pages from the index.
- Verify addresses, phone numbers, company-history, warranty and manufacturer claims used in page content or structured data.
- Review original service-specific content and internal linking, canonical URLs, UA/RU hreflang and sitemap.
- Measure mobile Core Web Vitals and check Search Console before making launch claims.

The baseline does not switch indexability or modify deployment protection.
