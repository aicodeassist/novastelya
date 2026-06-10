"use client";

import React, { useState } from "react";
import { CityConfig } from "@/config/geo-matrix";
import styles from "./CityBanner.module.css";
import { Button } from "@/components/ui";

type CityBannerClientProps = {
  city: CityConfig;
  locale: "uk" | "ru";
};

export function CityBannerClient({ city, locale }: CityBannerClientProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleConfirm = () => {
    // Set cookie for 30 days
    document.cookie = `preferred-city=${city.slug}; max-age=2592000; path=/`;
    setDismissed(true);
    // Reload to apply local prices/content
    window.location.reload();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  const cityName = city[locale];
  const questionText =
    locale === "uk"
      ? `Ваше місто ${cityName}?`
      : `Ваш город ${cityName}?`;

  const confirmText = locale === "uk" ? "Так, це моє місто" : "Да, это мой город";
  const changeText = locale === "uk" ? "Ні, інше" : "Нет, другой";

  return (
    <div className={styles.banner} role="banner" aria-label="Вибір міста">
      <div className={styles.content}>
        <span className={styles.text}>{questionText}</span>
        <div className={styles.actions}>
          <Button size="sm" variant="primary" onClick={handleConfirm}>
            {confirmText}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDismiss}>
            {changeText}
          </Button>
        </div>
      </div>
    </div>
  );
}
