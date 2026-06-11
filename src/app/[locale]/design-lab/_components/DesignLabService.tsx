"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import styles from "./DesignLabService.module.css";

type Props = {
  params: any;
};

export function DesignLabService({ params }: Props) {
  const locale = "uk"; // Default for design lab
  const isUk = locale === "uk";

  // State for Before/After Slider percentage
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left click held down
      handleSliderMove(e.clientX);
    }
  };

  return (
    <div className={styles.designLabWrapper}>
      {/* Design Lab Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.topBarBrand}>
            <span className={styles.labBadge}>LAB v2026</span>
            <span className={styles.labTitle}>NOVA STELYA Design Lab</span>
          </div>
          <nav className={styles.topBarNav}>
            <Link href="/design-lab" className={styles.navLink}>
              {isUk ? "Головна (Варіант)" : "Главная (Вариант)"}
            </Link>
            <Link href="/design-lab/matte-ceilings" className={`${styles.navLink} ${styles.navLinkActive}`}>
              {isUk ? "Матові стелі (Варіант)" : "Матовые потолки (Вариант)"}
            </Link>
            <Link href="/" className={styles.backLink}>
              {isUk ? "← На бойовий сайт" : "← На боевой сайт"}
            </Link>
          </nav>
        </div>
      </div>

      {/* Service Page Hero (Editorial Layout) */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.categoryBadge}>{isUk ? "Класичні рішення" : "Классические решения"}</span>
              <h1 className={styles.heroTitle}>
                {isUk ? (
                  <>Матові натяжні стелі з <span className={styles.italicText}>довічною</span> гарантією</>
                ) : (
                  <>Матовые натяжные потолки с <span className={styles.italicText}>пожизненной</span> гарантией</>
                )}
              </h1>
              <p className={styles.heroDesc}>
                {isUk
                  ? "Створюють ефект бездоганно поштукатуреної та пофарбованої стелі. Ніякого блиску та спотворень світла. Ідеально біла матова текстура з рівномірним світлопоглинанням."
                  : "Создают эффект безупречно оштукатуренного и покрашенного потолка. Никакого блеска и искажений света. Идеально белая матовая текстура с равномерным светопоглощением."}
              </p>
              
              <div className={styles.priceHighlight}>
                <div className={styles.priceBox}>
                  <span className={styles.priceLabel}>{isUk ? "Ціна під ключ" : "Цена под ключ"}</span>
                  <span className={styles.priceValue}>{isUk ? "від 350 грн/м²" : "от 350 грн/м²"}</span>
                </div>
                <div className={styles.worktimeBox}>
                  <span className={styles.priceLabel}>{isUk ? "Термін встановлення" : "Срок установки"}</span>
                  <span className={styles.priceValue}>{isUk ? "від 3 годин" : "от 3 часов"}</span>
                </div>
              </div>

              <div className={styles.heroActions}>
                <a href="#callback" className={styles.ctaPrimary}>
                  {isUk ? "Викликати замірника" : "Вызвать замерщика"}
                </a>
                <a href="#before-after" className={styles.ctaSecondary}>
                  {isUk ? "Дивитися до/після" : "Смотреть до/после"}
                </a>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200"
                alt="Minimalist matte stretch ceiling design"
                className={styles.visualImg}
              />
              <div className={styles.visualBanner}>
                <span className={styles.bannerNumber}>10</span>
                <span className={styles.bannerText}>
                  {isUk ? "років офіційної гарантії на полотно" : "лет официальной гарантии на полотно"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Interactive Slider Section */}
      <section id="before-after" className={styles.sliderSection}>
        <div className={styles.sliderHeader}>
          <span className={styles.sectionBadge}>{isUk ? "ФОКУС НА ЯКІСТЬ" : "ФОКУС НА КАЧЕСТВО"}</span>
          <h2 className={styles.sliderTitle}>
            {isUk ? "Трансформація вашого простору" : "Трансформация вашего пространства"}
          </h2>
          <p className={styles.sliderSubtitle}>
            {isUk
              ? "Перетягніть повзунок, щоб порівняти вигляд кімнати до та після встановлення натяжної стелі."
              : "Перетащите ползунок, чтобы сравнить вид комнаты до и после установки натяжного потолка."}
          </p>
        </div>

        {/* The Slider Component */}
        <div 
          ref={sliderRef}
          className={styles.sliderContainer}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* After image (the ceiling installed) */}
          <div className={styles.imageAfter}>
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200" 
              alt="After stretch ceiling installation" 
            />
            <div className={styles.sliderLabelRight}>AFTER (ПІСЛЯ)</div>
          </div>

          {/* Before image (clippable, showing the old room) */}
          <div 
            className={styles.imageBefore}
            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
          >
            <img 
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200" 
              alt="Before stretch ceiling installation" 
            />
            <div className={styles.sliderLabelLeft}>BEFORE (ДО)</div>
          </div>

          {/* Drag Bar */}
          <div 
            className={styles.sliderBar}
            style={{ left: `${sliderPos}%` }}
          >
            <div className={styles.sliderHandle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="8 5 3 12 8 19" />
                <polyline points="16 5 21 12 16 19" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className={styles.pricingSection}>
        <div className={styles.pricingContainer}>
          <div className={styles.pricingHeader}>
            <h2 className={styles.sliderTitle}>
              {isUk ? "Прозорі тарифи на матеріали" : "Прозрачные тарифные планы"}
            </h2>
            <p className={styles.sliderSubtitle}>
              {isUk
                ? "Ми пропонуємо три класи екологічності та міцності полотна під будь-який бюджет."
                : "Мы предлагаем три класса экологичности и прочности полотна под любой бюджет."}
            </p>
          </div>

          <div className={styles.pricingGrid}>
            {/* Plan 1 */}
            <div className={styles.pricingCard}>
              <span className={styles.cardTag}>MATTE CLASSIC</span>
              <h3>MSD Premium</h3>
              <span className={styles.cardPrice}>{isUk ? "від 350 грн/м²" : "от 350 грн/м²"}</span>
              <ul className={styles.cardFeatures}>
                <li>{isUk ? "Ширина полотна до 5.5 м" : "Ширина полотна до 5.5 м"}</li>
                <li>{isUk ? "Клас екологічності M1" : "Класс экологичности M1"}</li>
                <li>{isUk ? "Без неприємного запаху" : "Без неприятного запаха"}</li>
                <li>{isUk ? "Гарантія 10 років" : "Гарантия 10 лет"}</li>
              </ul>
              <button className={styles.priceCardBtn}>{isUk ? "Обрати тариф" : "Выбрать тариф"}</button>
            </div>

            {/* Plan 2 */}
            <div className={`${styles.pricingCard} ${styles.pricingCardHighlighted}`}>
              <span className={styles.cardTagGold}>MATTE ECO-EXCLUSIVE</span>
              <h3>TEQTUM Euro</h3>
              <span className={styles.cardPrice}>{isUk ? "від 450 грн/м²" : "от 450 грн/м²"}</span>
              <ul className={styles.cardFeatures}>
                <li>{isUk ? "Повна пожежна безпека (KM2)" : "Полная пожарная безопасность (KM2)"}</li>
                <li>{isUk ? "Сертифікат відповідності ЄС" : "Сертификат соответствия ЕС"}</li>
                <li>{isUk ? "Ультра-міцне армування" : "Ультра-прочное армирование"}</li>
                <li>{isUk ? "Гарантія 15 років" : "Гарантия 15 лет"}</li>
              </ul>
              <button className={styles.priceCardBtnGold}>{isUk ? "Обрати тариф" : "Выбрать тариф"}</button>
            </div>

            {/* Plan 3 */}
            <div className={styles.pricingCard}>
              <span className={styles.cardTag}>MATTE PREMIUM TEXTILE</span>
              <h3>DESCOR (Німеччина)</h3>
              <span className={styles.cardPrice}>{isUk ? "від 850 грн/м²" : "от 850 грн/м²"}</span>
              <ul className={styles.cardFeatures}>
                <li>{isUk ? "Преміальна тканинна основа" : "Премиальная тканевая основа"}</li>
                <li>{isUk ? "Повітропроникна структура" : "Воздухопроницаемая структура"}</li>
                <li>{isUk ? "Морозостійкість до -15°C" : "Морозоустойчивость до -15°C"}</li>
                <li>{isUk ? "Гарантія 20 років" : "Гарантия 20 лет"}</li>
              </ul>
              <button className={styles.priceCardBtn}>{isUk ? "Обрати тариф" : "Выбрать тариф"}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Design Lab */}
      <footer className={styles.labFooter}>
        <p>© 2026 NOVA STELYA. World-Class Design Invariant Showcase.</p>
      </footer>
    </div>
  );
}
