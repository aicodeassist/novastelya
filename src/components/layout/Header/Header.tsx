"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CitySelector } from "../CitySelector/CitySelector";
import { CityConfig, getCityBySlug } from "@/config/geo-matrix";
import { parsePathname } from "@/lib/route-resolver";
import { BottomSheet } from "./BottomSheet";
import styles from "./Header.module.css";

type HeaderProps = {
  currentCity: CityConfig | null;
  locale: "uk" | "ru";
};

const hasHeroHero = (pathname: string) => {
  const cleanPath = pathname.replace(/^\/(ru|uk)/, "").replace(/^\//, "");
  if (cleanPath === "" || !cleanPath.includes("/")) {
    const nonHeroPages = ["about", "contacts", "prices", "portfolio", "faq", "blog"];
    if (nonHeroPages.includes(cleanPath)) return false;
    return true;
  }
  const parts = cleanPath.split("/");
  const lastPart = parts[parts.length - 1];
  const nonHeroSubpages = ["about", "contacts", "prices", "portfolio", "faq", "blog"];
  if (nonHeroSubpages.includes(lastPart)) return false;
  return true;
};

export function Header({ currentCity: propCity, locale: propLocale }: HeaderProps) {
  const pathname = usePathname();
  const { locale, city: cityFromUrl } = parsePathname(pathname || "");
  const [currentCity, setCurrentCity] = useState<CityConfig | null>(cityFromUrl || propCity);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const isHeroPage = hasHeroHero(pathname || "");

  useEffect(() => {
    if (cityFromUrl) {
      setCurrentCity(cityFromUrl);
    } else {
      const cookies = document.cookie.split("; ");
      const preferredCityCookie = cookies.find((row) => row.startsWith("preferred-city="));
      if (preferredCityCookie) {
        const citySlug = preferredCityCookie.split("=")[1];
        const cityConfig = getCityBySlug(citySlug);
        if (cityConfig && cityConfig.active) {
          setCurrentCity(cityConfig);
        } else {
          setCurrentCity(null);
        }
      } else {
        setCurrentCity(null);
      }
    }
  }, [pathname, cityFromUrl, propCity]);

  useEffect(() => {
    if (!isHeroPage) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isHeroPage]);

  useEffect(() => {
    const isLocked = mobileMenuOpen || isBottomSheetOpen;
    if (isLocked) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [mobileMenuOpen, isBottomSheetOpen]);

  const toggleLocaleUrl = (targetLocale: "uk" | "ru") => {
    const segments = (pathname || "").split("/").filter(Boolean);
    if (segments[0] === "ru") {
      segments.shift();
    }
    const basePath = `/${segments.join("/")}`;
    const finalPath =
      targetLocale === "ru"
        ? `/ru${basePath === "/" ? "" : basePath}`
        : basePath === ""
        ? "/"
        : basePath;
    
    return finalPath.endsWith("/") && finalPath.length > 1
      ? finalPath.slice(0, -1)
      : finalPath === ""
      ? "/"
      : finalPath;
  };

  const navPrefix = locale === "ru" ? "/ru" : "";
  const cityPrefix = currentCity ? `/${currentCity.slug}` : "";

  // Helper to append city context if present
  const localizedUrl = (path: string) => {
    if (path === "/") {
      return `${navPrefix}${cityPrefix}` === "" ? "/" : `${navPrefix}${cityPrefix}`;
    }
    return `${navPrefix}${cityPrefix}${path}`;
  };

  const isHeaderScrolled = scrolled || mobileMenuOpen;

  return (
    <>
      <header className={`${styles.header} ${isHeaderScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href={localizedUrl("/")} className={styles.logo} aria-label="NOVA STELYA — головна">
          NOVA{" "}<span>STELYA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Головне меню">
          <ul className={styles.navList}>
            <li
              className={styles.navItem}
              onMouseEnter={() => setCatalogOpen(true)}
              onMouseLeave={() => setCatalogOpen(false)}
            >
              <button
                className={`${styles.navLink} ${catalogOpen ? styles["navLink--active"] : ""}`}
                aria-expanded={catalogOpen}
              >
                {locale === "uk" ? "Послуги" : "Услуги"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {catalogOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownGrid}>
                    <div>
                      <h4 className={styles.dropdownCategory}>
                        {locale === "uk" ? "Матеріали" : "Материалы"}
                      </h4>
                      <ul>
                        <li>
                          <Link href={localizedUrl("/matte-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Матові стелі" : "Матовые потолки"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/glossy-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Глянцеві стелі" : "Глянцевые потолки"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/satin-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Сатинові стелі" : "Сатиновые потолки"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/fabric-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Тканинні стелі" : "Тканевые потолки"}
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={styles.dropdownCategory}>
                        {locale === "uk" ? "Конструкції" : "Конструкции"}
                      </h4>
                      <ul>
                        <li>
                          <Link href={localizedUrl("/shadow-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Тіньові стелі" : "Теневые потолки"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/floating-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Парящі стелі" : "Парящие потолки"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/slotted-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Нішеві стелі" : "Нишевые потолки"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/double-level-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Дворівневі стелі" : "Двухуровневые потолки"}
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={styles.dropdownCategory}>
                        {locale === "uk" ? "Освітлення" : "Освещение"}
                      </h4>
                      <ul>
                        <li>
                          <Link href={localizedUrl("/light-lines")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Світлові лінії" : "Световые линии"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/track-lighting")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Трекове світло" : "Трековый свет"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/backlight")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Контурне підсвічування" : "Контурная подсветка"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/starry-sky")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Зоряне небо" : "Звездное небо"}
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={styles.dropdownCategory}>
                        {locale === "uk" ? "Приміщення" : "Помещения"}
                      </h4>
                      <ul>
                        <li>
                          <Link href={localizedUrl("/kitchen-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Кухня" : "Кухня"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/bathroom-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Ванна кімната" : "Ванная комната"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/bedroom-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Спальня" : "Спальня"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/living-room-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Вітальня" : "Гостиная"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/childrens-room-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Дитяча" : "Детская"}
                          </Link>
                        </li>
                        <li>
                          <Link href={localizedUrl("/office-ceilings")} onClick={() => setCatalogOpen(false)}>
                            {locale === "uk" ? "Офіс" : "Офис"}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li className={styles.navItem}>
              <Link href={localizedUrl("/prices")} className={styles.navLink}>
                {locale === "uk" ? "Ціни" : "Цены"}
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={localizedUrl("/portfolio")} className={styles.navLink}>
                {locale === "uk" ? "Портфоліо" : "Портфолио"}
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={localizedUrl("/faq")} className={styles.navLink}>
                FAQ
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={navPrefix ? `${navPrefix}/blog` : "/blog"} className={styles.navLink}>
                {locale === "uk" ? "Блог" : "Блог"}
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={navPrefix ? `${navPrefix}/about` : "/about"} className={styles.navLink}>
                {locale === "uk" ? "Про компанію" : "О компании"}
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={localizedUrl("/contacts")} className={styles.navLink}>
                {locale === "uk" ? "Контакти" : "Контакты"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.desktopOnly}>
            <CitySelector currentCity={currentCity} locale={locale} className={isHeaderScrolled ? styles.cityTriggerScrolled : styles.cityTrigger} />
          </div>

          <div className={`${styles.langSelector} ${styles.desktopOnly}`} role="navigation" aria-label="Вибір мови">
            <Link
              href={toggleLocaleUrl("uk")}
              className={`${styles.langLink} ${locale === "uk" ? styles["langLink--active"] : ""}`}
            >UK</Link>
            <span className={styles.langSeparator}>/</span>
            <Link
              href={toggleLocaleUrl("ru")}
              className={`${styles.langLink} ${locale === "ru" ? styles["langLink--active"] : ""}`}
            >RU</Link>
          </div>

          <a href={`tel:${currentCity ? currentCity.phone.replace(/\s+/g, "") : "+380800000000"}`} className={`${styles.phoneLink} ${styles.desktopOnly}`}>
            {currentCity ? currentCity.phone : "0 800 000-000"}
          </a>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Відкрити меню"
            aria-expanded={mobileMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileNavList}>
            <li>
              <Link href={localizedUrl("/")} onClick={() => setMobileMenuOpen(false)}>
                {locale === "uk" ? "Головна" : "Главная"}
              </Link>
            </li>

            {/* Collapsible Services for Mobile */}
            <li className={styles.mobileNavItem}>
              <button
                type="button"
                className={styles.mobileNavButton}
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                <span>{locale === "uk" ? "Послуги" : "Услуги"}</span>
                <svg
                  className={`${styles.mobileChevron} ${mobileServicesOpen ? styles.mobileChevronOpen : ""}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {mobileServicesOpen && (
                <div className={styles.mobileSubMenu}>
                  {/* Materials */}
                  <div className={styles.mobileSubCategory}>
                    <h5>{locale === "uk" ? "Матеріали" : "Материалы"}</h5>
                    <ul>
                      <li><Link href={localizedUrl("/matte-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Матові стелі" : "Матовые потолки"}</Link></li>
                      <li><Link href={localizedUrl("/glossy-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Глянцеві стелі" : "Глянцевые потолки"}</Link></li>
                      <li><Link href={localizedUrl("/satin-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Сатинові стелі" : "Сатиновые потолки"}</Link></li>
                      <li><Link href={localizedUrl("/fabric-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Тканинні стелі" : "Тканевые потолки"}</Link></li>
                    </ul>
                  </div>
                  {/* Structures */}
                  <div className={styles.mobileSubCategory}>
                    <h5>{locale === "uk" ? "Конструкції" : "Конструкции"}</h5>
                    <ul>
                      <li><Link href={localizedUrl("/shadow-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Тіньові стелі" : "Теневые потолки"}</Link></li>
                      <li><Link href={localizedUrl("/floating-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Парящі стелі" : "Парящие потолки"}</Link></li>
                      <li><Link href={localizedUrl("/slotted-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Нішеві стелі" : "Нишевые потолки"}</Link></li>
                      <li><Link href={localizedUrl("/double-level-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Дворівневі стелі" : "Двухуровневые потолки"}</Link></li>
                    </ul>
                  </div>
                  {/* Lighting */}
                  <div className={styles.mobileSubCategory}>
                    <h5>{locale === "uk" ? "Освітлення" : "Освещение"}</h5>
                    <ul>
                      <li><Link href={localizedUrl("/light-lines")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Світлові лінії" : "Световые линии"}</Link></li>
                      <li><Link href={localizedUrl("/track-lighting")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Трекове світло" : "Трековый свет"}</Link></li>
                      <li><Link href={localizedUrl("/backlight")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Контурне підсвічування" : "Контурная подсветка"}</Link></li>
                      <li><Link href={localizedUrl("/starry-sky")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Зоряне небо" : "Звездное небо"}</Link></li>
                    </ul>
                  </div>
                  {/* Rooms */}
                  <div className={styles.mobileSubCategory}>
                    <h5>{locale === "uk" ? "Приміщення" : "Помещения"}</h5>
                    <ul>
                      <li><Link href={localizedUrl("/kitchen-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Кухня" : "Кухня"}</Link></li>
                      <li><Link href={localizedUrl("/bathroom-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Ванна кімната" : "Ванная комната"}</Link></li>
                      <li><Link href={localizedUrl("/bedroom-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Спальня" : "Спальня"}</Link></li>
                      <li><Link href={localizedUrl("/living-room-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Вітальня" : "Гостиная"}</Link></li>
                      <li><Link href={localizedUrl("/childrens-room-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Дитяча" : "Детская"}</Link></li>
                      <li><Link href={localizedUrl("/office-ceilings")} onClick={() => setMobileMenuOpen(false)}>{locale === "uk" ? "Офіс" : "Офис"}</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link href={localizedUrl("/prices")} onClick={() => setMobileMenuOpen(false)}>
                {locale === "uk" ? "Ціни" : "Цены"}
              </Link>
            </li>
            <li>
              <Link href={localizedUrl("/portfolio")} onClick={() => setMobileMenuOpen(false)}>
                {locale === "uk" ? "Портфоліо" : "Портфолио"}
              </Link>
            </li>
            <li>
              <Link href={localizedUrl("/faq")} onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
            </li>
            <li>
              <Link href={navPrefix ? `${navPrefix}/blog` : "/blog"} onClick={() => setMobileMenuOpen(false)}>
                {locale === "uk" ? "Блог" : "Блог"}
              </Link>
            </li>
            <li>
              <Link href={navPrefix ? `${navPrefix}/about` : "/about"} onClick={() => setMobileMenuOpen(false)}>
                {locale === "uk" ? "Про компанію" : "О компании"}
              </Link>
            </li>
            <li>
              <Link href={localizedUrl("/contacts")} onClick={() => setMobileMenuOpen(false)}>
                {locale === "uk" ? "Контакти" : "Контакты"}
              </Link>
            </li>

            {/* Mobile Phone Number Callout */}
            <li className={styles.mobilePhoneRow}>
              <a href={`tel:${currentCity ? currentCity.phone.replace(/\s+/g, "") : "+380800000000"}`} className={styles.mobilePhoneLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{currentCity ? currentCity.phone : "0 800 000-000"}</span>
              </a>
            </li>

            {/* Mobile Meta (Language & City) Selector */}
            <li className={styles.mobileMetaRow}>
              <div className={styles.mobileCitySelector}>
                <CitySelector currentCity={currentCity} locale={locale} className={styles.mobileCityTrigger} />
              </div>
              <div className={styles.mobileLangSelector} role="navigation" aria-label="Вибір мови">
                <Link
                  href={toggleLocaleUrl("uk")}
                  className={`${styles.mobileLangLink} ${locale === "uk" ? styles["mobileLangLink--active"] : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >UK</Link>
                <span className={styles.mobileLangSeparator}>/</span>
                <Link
                  href={toggleLocaleUrl("ru")}
                  className={`${styles.mobileLangLink} ${locale === "ru" ? styles["mobileLangLink--active"] : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >RU</Link>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className={styles.mobileNav} aria-label={locale === "uk" ? "Мобільна навігація" : "Мобильная навигация"}>
        <Link href={localizedUrl("/")} className={`${styles.mobileNavItem} ${pathname === localizedUrl("/") ? styles.active : ""}`} onClick={() => setMobileMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span>{locale === "uk" ? "Головна" : "Главная"}</span>
        </Link>
        <a href="#calculator" className={styles.mobileNavItem} onClick={() => setMobileMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>{locale === "uk" ? "Калькулятор" : "Калькулятор"}</span>
        </a>
        
        {/* Center Call Button with Shimmer */}
        <button
          type="button"
          className={styles.mobileCallTrigger}
          onClick={() => {
            setMobileMenuOpen(false);
            setIsBottomSheetOpen(true);
          }}
          aria-label={locale === "uk" ? "Зв'язатися" : "Связаться"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>

        <Link href={localizedUrl("/portfolio")} className={`${styles.mobileNavItem} ${pathname.includes("/portfolio") ? styles.active : ""}`} onClick={() => setMobileMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>{locale === "uk" ? "Портфоліо" : "Портфолио"}</span>
        </Link>
        
        <button
          type="button"
          className={`${styles.mobileNavItem} ${mobileMenuOpen ? styles.active : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>{locale === "uk" ? "Меню" : "Меню"}</span>
        </button>
      </nav>

      {/* Render the Swipeable Bottom Sheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        locale={locale}
        currentCity={currentCity}
      />
    </>
  );
}
