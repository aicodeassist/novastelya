import { getCityBySlug, CityConfig } from "@/config/geo-matrix";
import { getServiceBySlug, ServiceConfig } from "@/config/services.config";

export type ResolvedRoute =
  | { type: "home"; locale: "uk" | "ru" }
  | { type: "city-hub"; city: CityConfig; locale: "uk" | "ru" }
  | { type: "service"; service: ServiceConfig; locale: "uk" | "ru" }
  | { type: "city-service"; city: CityConfig; service: ServiceConfig; locale: "uk" | "ru" }
  | { type: "prices"; city: CityConfig | null; locale: "uk" | "ru" }
  | { type: "calculator"; city: CityConfig | null; locale: "uk" | "ru" }
  | { type: "faq"; city: CityConfig | null; locale: "uk" | "ru" }
  | { type: "portfolio"; city: CityConfig | null; locale: "uk" | "ru" }
  | { type: "contacts"; city: CityConfig | null; locale: "uk" | "ru" }
  | { type: "about"; locale: "uk" | "ru" }
  | { type: "blog"; locale: "uk" | "ru" }
  | { type: "redirect"; url: string }
  | { type: "not-found" };

export function resolveRoute(
  localeParam: string | undefined,
  cityParam: string | undefined = undefined,
  serviceParam: string | undefined = undefined
): ResolvedRoute {
  // Case 1: Three segments (prefixed Russian city pages: /ru/kyiv/matte-ceilings, /ru/kyiv/prices, etc.)
  if (localeParam && cityParam && serviceParam) {
    const locale = localeParam as "uk" | "ru";
    if (locale === "uk" || locale === "ru") {
      const cityConfig = getCityBySlug(cityParam);
      if (cityConfig && cityConfig.active) {
        if (serviceParam === "prices") {
          return { type: "prices", city: cityConfig, locale };
        }
        if (serviceParam === "calculator") {
          return { type: "calculator", city: cityConfig, locale };
        }
        if (serviceParam === "portfolio") {
          return { type: "portfolio", city: cityConfig, locale };
        }
        if (serviceParam === "faq") {
          return { type: "faq", city: cityConfig, locale };
        }
        if (serviceParam === "contacts") {
          return { type: "contacts", city: cityConfig, locale };
        }
        if (serviceParam === "blog") {
          return { type: "redirect", url: locale === "ru" ? "/ru/blog" : "/blog" };
        }
        if (serviceParam === "about") {
          return { type: "redirect", url: locale === "ru" ? "/ru/about" : "/about" };
        }
        const serviceConfig = getServiceBySlug(serviceParam);
        if (serviceConfig) {
          return { type: "city-service", city: cityConfig, service: serviceConfig, locale };
        }
      }
    }
    return { type: "not-found" };
  }

  // Case 2: Two segments (/ru/kyiv, /kyiv/matte-ceilings, /kyiv/prices, /ru/prices, /ru/matte-ceilings)
  if (localeParam && cityParam) {
    // A. Prefix-less Ukrainian city sub-pages: e.g. /kyiv/matte-ceilings, /kyiv/prices
    const cityConfig = getCityBySlug(localeParam);
    if (cityConfig && cityConfig.active) {
      if (cityParam === "prices") {
        return { type: "prices", city: cityConfig, locale: "uk" };
      }
      if (cityParam === "calculator") {
        return { type: "calculator", city: cityConfig, locale: "uk" };
      }
      if (cityParam === "portfolio") {
        return { type: "portfolio", city: cityConfig, locale: "uk" };
      }
      if (cityParam === "faq") {
        return { type: "faq", city: cityConfig, locale: "uk" };
      }
      if (cityParam === "contacts") {
        return { type: "contacts", city: cityConfig, locale: "uk" };
      }
      if (cityParam === "blog") {
        return { type: "redirect", url: "/blog" };
      }
      if (cityParam === "about") {
        return { type: "redirect", url: "/about" };
      }
      const serviceConfig = getServiceBySlug(cityParam);
      if (serviceConfig) {
        return { type: "city-service", city: cityConfig, service: serviceConfig, locale: "uk" };
      }
      return { type: "not-found" };
    }

    // B. Prefixed city hub or service page: e.g. /ru/kyiv, /ru/prices, /ru/matte-ceilings
    if (localeParam === "uk" || localeParam === "ru") {
      const locale = localeParam as "uk" | "ru";
      const targetCity = getCityBySlug(cityParam);
      if (targetCity && targetCity.active) {
        return { type: "city-hub", city: targetCity, locale };
      }
      const serviceConfig = getServiceBySlug(cityParam);
      if (serviceConfig) {
        return { type: "service", service: serviceConfig, locale };
      }
      if (cityParam === "prices") {
        return { type: "prices", city: null, locale };
      }
      if (cityParam === "calculator") {
        return { type: "calculator", city: null, locale };
      }
      if (cityParam === "portfolio") {
        return { type: "portfolio", city: null, locale };
      }
      if (cityParam === "faq") {
        return { type: "faq", city: null, locale };
      }
      if (cityParam === "contacts") {
        return { type: "contacts", city: null, locale };
      }
      if (cityParam === "about") {
        return { type: "about", locale };
      }
      if (cityParam === "blog") {
        return { type: "blog", locale };
      }
    }
    return { type: "not-found" };
  }

  // Case 3: One segment (/kyiv, /matte-ceilings, /prices, /ru, /uk)
  if (localeParam) {
    // A. City Hub (prefix-less Ukrainian): e.g. /kyiv
    const cityConfig = getCityBySlug(localeParam);
    if (cityConfig && cityConfig.active) {
      return { type: "city-hub", city: cityConfig, locale: "uk" };
    }

    // B. General Service (prefix-less Ukrainian): e.g. /matte-ceilings
    const serviceConfig = getServiceBySlug(localeParam);
    if (serviceConfig) {
      return { type: "service", service: serviceConfig, locale: "uk" };
    }

    // C. Static page (prefix-less Ukrainian) or Locale root (/ru, /uk)
    if (localeParam === "uk" || localeParam === "ru") {
      return { type: "home", locale: localeParam as "uk" | "ru" };
    }
    if (localeParam === "prices") {
      return { type: "prices", city: null, locale: "uk" };
    }
    if (localeParam === "calculator") {
      return { type: "calculator", city: null, locale: "uk" };
    }
    if (localeParam === "portfolio") {
      return { type: "portfolio", city: null, locale: "uk" };
    }
    if (localeParam === "faq") {
      return { type: "faq", city: null, locale: "uk" };
    }
    if (localeParam === "contacts") {
      return { type: "contacts", city: null, locale: "uk" };
    }
    if (localeParam === "about") {
      return { type: "about", locale: "uk" };
    }
    if (localeParam === "blog") {
      return { type: "blog", locale: "uk" };
    }
  }

  return { type: "not-found" };
}

// Client/Server parameter decoders for active city and locale
export function getActiveCityFromParams(params: any): CityConfig | null {
  if (!params) return null;
  const locale = params.locale as string | undefined;
  const city = params.city as string | undefined;

  const cityFromLocale = getCityBySlug(locale);
  if (cityFromLocale && cityFromLocale.active) return cityFromLocale;

  const cityFromCity = getCityBySlug(city);
  if (cityFromCity && cityFromCity.active) return cityFromCity;

  return null;
}

export function getActiveLocaleFromParams(params: any): "uk" | "ru" {
  if (!params) return "uk";
  const locale = params.locale as string | undefined;
  if (locale === "ru") return "ru";
  return "uk";
}

export function parsePathname(pathname: string): { locale: "uk" | "ru"; city: CityConfig | null } {
  const segments = pathname.split("/").filter(Boolean);
  
  let locale: "uk" | "ru" = "uk";
  if (segments[0] === "ru") {
    locale = "ru";
    segments.shift();
  }
  
  const citySlug = segments[0] || "";
  const city = getCityBySlug(citySlug);
  
  return {
    locale,
    city: city && city.active ? city : null,
  };
}
