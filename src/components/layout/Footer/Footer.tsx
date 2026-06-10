"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CityConfig, getCityBySlug } from "@/config/geo-matrix";
import { parsePathname } from "@/lib/route-resolver";
import styles from "./Footer.module.css";

type FooterProps = {
  currentCity: CityConfig | null;
  locale: "uk" | "ru";
};

export function Footer({ currentCity: propCity, locale: propLocale }: FooterProps) {
  const pathname = usePathname();
  const { locale, city: cityFromUrl } = parsePathname(pathname || "");
  const [currentCity, setCurrentCity] = useState<CityConfig | null>(cityFromUrl || propCity);

  useEffect(() => {
    if (cityFromUrl) {
      setCurrentCity(cityFromUrl);
      return;
    }

    const cookies = document.cookie.split("; ");
    const preferredCityCookie = cookies.find((row) => row.startsWith("preferred-city="));
    if (preferredCityCookie) {
      const citySlug = preferredCityCookie.split("=")[1];
      const cityConfig = getCityBySlug(citySlug);
      if (cityConfig && cityConfig.active) {
        setCurrentCity(cityConfig);
        return;
      }
    }

    setCurrentCity(null);
  }, [pathname, cityFromUrl, propCity]);
  const navPrefix = locale === "ru" ? "/ru" : "";
  const cityPrefix = currentCity ? `/${currentCity.slug}` : "";

  const localizedUrl = (path: string) => {
    if (path === "/") {
      return `${navPrefix}${cityPrefix}` === "" ? "/" : `${navPrefix}${cityPrefix}`;
    }
    return `${navPrefix}${cityPrefix}${path}`;
  };

  const address = currentCity
    ? locale === "uk"
      ? currentCity.address
      : currentCity.addressRu
    : locale === "uk"
    ? "Київ, вул. Хрещатик, 1 (Головний офіс)"
    : "Киев, ул. Крещатик, 1 (Главный офис)";

  const phone = currentCity ? currentCity.phone : "0 800 000-000";
  const hours = currentCity ? currentCity.officeHours : "Пн-Сб 9:00-19:00";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo & Info */}
          <div className={styles.brandCol}>
            <Link href={localizedUrl("/")} className={styles.logo} aria-label="NOVA STELYA — головна">
              NOVA{" "}<span>STELYA</span>
            </Link>
            <p className={styles.brandDesc}>
              {locale === "uk"
                ? "Професійний монтаж натяжних стель преміум-класу в Україні. Золотий стандарт якості та довговічності."
                : "Профессиональный монтаж натяжных потолков премиум-класса в Украине. Золотой стандарт качества и долговечности."}
            </p>
          </div>

          {/* Catalog Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.title}>{locale === "uk" ? "Послуги" : "Услуги"}</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href={localizedUrl("/matte-ceilings")}>
                  {locale === "uk" ? "Матові стелі" : "Матовые потолки"}
                </Link>
              </li>
              <li>
                <Link href={localizedUrl("/shadow-ceilings")}>
                  {locale === "uk" ? "Тіньові стелі" : "Tеневые потолки"}
                </Link>
              </li>
              <li>
                <Link href={localizedUrl("/light-lines")}>
                  {locale === "uk" ? "Світлові лінії" : "Световые линии"}
                </Link>
              </li>
              <li>
                <Link href={localizedUrl("/kitchen-ceilings")}>
                  {locale === "uk" ? "Стелі на кухню" : "Потолки на кухню"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.title}>{locale === "uk" ? "Навігація" : "Навигация"}</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href={localizedUrl("/prices")}>{locale === "uk" ? "Ціни" : "Цены"}</Link>
              </li>
              <li>
                <Link href={localizedUrl("/portfolio")}>{locale === "uk" ? "Портфоліо" : "Портфолио"}</Link>
              </li>
              <li>
                <Link href={localizedUrl("/faq")}>FAQ</Link>
              </li>
              <li>
                <Link href={navPrefix ? `${navPrefix}/blog` : "/blog"}>{locale === "uk" ? "Блог" : "Блог"}</Link>
              </li>
              <li>
                <Link href={navPrefix ? `${navPrefix}/about` : "/about"}>
                  {locale === "uk" ? "Про компанію" : "О компании"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className={styles.contactCol}>
            <h4 className={styles.title}>{locale === "uk" ? "Контакти" : "Контакты"}</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{address}</span>
              </li>
              <li className={styles.contactItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
              </li>
              <li className={styles.contactItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} NOVA STELYA. All rights reserved. Premium Gold Standard 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
