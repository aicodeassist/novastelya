"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { activeCities, CityConfig, getCityBySlug } from "@/config/geo-matrix";
import { getActiveCityFromParams } from "@/lib/route-resolver";
import styles from "./CitySelector.module.css";

type CitySelectorProps = {
  currentCity: CityConfig | null;
  locale: "uk" | "ru";
  className?: string;
};

export function CitySelector({ currentCity: propCity, locale: propLocale, className }: CitySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentCity = getActiveCityFromParams(params) || propCity;
  const locale = (params.locale === "ru" ? "ru" : "uk") as "uk" | "ru";
  const [isOpen, setIsOpen] = useState(false);

  const handleCityChange = (citySlug: string | null) => {
    // 1. Set/remove cookie
    if (citySlug) {
      document.cookie = `preferred-city=${citySlug}; max-age=2592000; path=/`;
    } else {
      document.cookie = `preferred-city=; max-age=0; path=/`;
    }

    setIsOpen(false);

    // 2. Compute the new URL path
    const pathSegments = pathname.split("/").filter(Boolean);

    // Remove locale prefix if present
    if (pathSegments[0] === "ru") {
      pathSegments.shift();
    }

    const firstSegment = pathSegments[0] || "";
    const cityConfigInPath = getCityBySlug(firstSegment);
    const hasCityInPath = cityConfigInPath && cityConfigInPath.active;

    let newPath = "";

    if (hasCityInPath) {
      pathSegments.shift(); // remove old city slug
      if (citySlug) {
        newPath = `/${citySlug}/${pathSegments.join("/")}`;
      } else {
        newPath = `/${pathSegments.join("/")}`;
      }
    } else {
      // URL has no city slug (e.g. root "/", "/matte-ceilings", "/prices")
      const isService = [
        "matte-ceilings",
        "glossy-ceilings",
        "satin-ceilings",
        "fabric-ceilings",
        "shadow-ceilings",
        "floating-ceilings",
        "slotted-ceilings",
        "carved-ceilings",
        "double-level-ceilings",
        "light-lines",
        "track-lighting",
        "backlight",
        "starry-sky",
        "kitchen-ceilings",
        "bathroom-ceilings",
        "bedroom-ceilings",
        "living-room-ceilings",
      ].includes(firstSegment);
      const isPrices = firstSegment === "prices";
      const isFaq = firstSegment === "faq";
      const isPortfolio = firstSegment === "portfolio";
      const isContacts = firstSegment === "contacts";

      if (isService || isPrices || isFaq || isPortfolio || isContacts) {
        if (citySlug) {
          newPath = `/${citySlug}/${pathSegments.join("/")}`;
        } else {
          newPath = `/${pathSegments.join("/")}`;
        }
      } else if (firstSegment === "") {
        // Root page
        if (citySlug) {
          newPath = `/${citySlug}`;
        } else {
          newPath = "/";
        }
      } else {
        // Non city-specific pages (e.g. about, blog)
        window.location.reload();
        return;
      }
    }

    // 3. Assemble and push new URL
    const prefix = locale === "ru" ? "/ru" : "";
    const finalPath = `${prefix}${newPath === "/" ? "" : newPath}`;
    
    // Ensure clean slash handling
    const cleanedPath =
      finalPath.endsWith("/") && finalPath.length > 1
        ? finalPath.slice(0, -1)
        : finalPath === ""
        ? "/"
        : finalPath;

    router.push(cleanedPath);
  };

  return (
    <div className={styles.container}>
      <button className={`${styles.trigger} ${className || ""}`} onClick={() => setIsOpen(!isOpen)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{currentCity ? currentCity[locale] : locale === "uk" ? "Вся Україна" : "Вся Украина"}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles["chevron--open"] : ""}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <ul className={styles.dropdown}>
            <li
              className={!currentCity ? styles["item--active"] : ""}
              onClick={() => handleCityChange(null)}
            >
              {locale === "uk" ? "Вся Україна" : "Вся Украина"}
            </li>
            {activeCities.map((city) => (
              <li
                key={city.slug}
                className={currentCity?.slug === city.slug ? styles["item--active"] : ""}
                onClick={() => handleCityChange(city.slug)}
              >
                {city[locale]}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
