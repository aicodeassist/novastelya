import servicesJson from "@/config/services.json";

export type ServiceSlug = string;

export type ServiceConfig = {
  slug: ServiceSlug;
  category: "materials" | "designs" | "lighting" | "rooms";
  basePrice: number; // Базова ціна за м² в грн
  uk: {
    title: string;
    description: string;
    h1: string;
    breadcrumb: string;
  };
  ru: {
    title: string;
    description: string;
    h1: string;
    breadcrumb: string;
  };
};

export const services: ServiceConfig[] = servicesJson as ServiceConfig[];

export function getServiceBySlug(slug: string | undefined): ServiceConfig | null {
  if (!slug) return null;
  return services.find(s => s.slug === slug) ?? null;
}
