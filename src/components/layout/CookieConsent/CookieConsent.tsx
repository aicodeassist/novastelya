"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import styles from "./CookieConsent.module.css";

type CookieConsentProps = {
  locale: "uk" | "ru";
};

export function CookieConsent({ locale }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const isUk = locale === "uk";

  useEffect(() => {
    // Check if consent cookie exists
    const cookies = document.cookie.split("; ");
    const consentCookie = cookies.find((row) => row.startsWith("cookie-consent="));

    if (!consentCookie) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie for 1 year
    document.cookie = "cookie-consent=accepted; max-age=31536000; path=/";
    setShowBanner(false);
  };

  const handleDecline = () => {
    document.cookie = "cookie-consent=declined; max-age=31536000; path=/";
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <div className={styles.content}>
        <p className={styles.text}>
          {isUk
            ? "Ми використовуємо файли cookie для покращення роботи нашого сайту та аналітики. Ви можете погодитися на їх використання або налаштувати параметри."
            : "Мы используем файлы cookie для улучшения работы нашего сайта и аналитики. Вы можете согласиться на их использование или настроить параметры."}
        </p>
        <div className={styles.actions}>
          <Button size="sm" variant="primary" onClick={handleAccept}>
            {isUk ? "Прийняти всі" : "Принять все"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDecline}>
            {isUk ? "Відхилити" : "Отклонить"}
          </Button>
        </div>
      </div>
    </div>
  );
}
