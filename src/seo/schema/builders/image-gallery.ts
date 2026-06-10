import { WithContext, ImageGallery } from "schema-dts";
import { SITE_URL } from "@/seo/constants/site";

type BuildImageGalleryParams = {
  title: string;
  description: string;
  url: string;
  images: string[];
};

export function buildImageGallery({
  title,
  description,
  url,
  images,
}: BuildImageGalleryParams): WithContext<ImageGallery> {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": title,
    "description": description,
    "url": url,
    "image": images.map((img) => ({
      "@type": "ImageObject",
      "url": img.startsWith("http") ? img : `${SITE_URL}${img}`,
    })),
  };
}
