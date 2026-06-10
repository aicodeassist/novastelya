import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOVA STELYA",
    short_name: "NovaStelya",
    description: "Преміальні натяжні стелі в Україні. Золотий стандарт якості.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0e",
    theme_color: "#d4a359",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
