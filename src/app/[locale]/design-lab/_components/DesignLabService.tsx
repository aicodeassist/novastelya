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
              <span className={styles.categoryBadge}>{isUk ? "КЛАСИЧНІ МАТЕРІАЛИ" : "КЛАССИЧЕСКИЕ МАТЕРИАЛЫ"}</span>
              <h1 className={styles.heroTitle}>
                {isUk ? (
                  <>Матові натяжні стелі з <span className={styles.italicText}>довічною</span> гарантією</>
                ) : (
                  <>Матовые натяжные потолки с <span className={styles.italicText}>пожизненной</span> гарантией</>
                )}
              </h1>
              <p className={styles.heroDesc}>
                {isUk
                  ? "Створюють бездоганний ефект дорогої штукатурки. Жодного зайвого блиску чи відблисків світла. Ідеально біле матове полотно з рівномірною глибиною кольору та повним поглинанням світлового шуму."
                  : "Создают безупречный эффект дорогой штукатурки. Никакого лишнего блеска или бликов света. Идеально белое матовое полотно с равномерной глубиной цвета и полным поглощением светового шума."}
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
                <a href="#callback-form" className={styles.ctaPrimary}>
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
                alt="Minimalist matte stretch ceiling design by Nova Stelya"
                className={styles.visualImg}
              />
              <div className={styles.visualBanner}>
                <span className={styles.bannerNumber}>15</span>
                <span className={styles.bannerText}>
                  {isUk ? "років офіційної гарантії на полотна" : "лет официальной гарантии на полотна"}
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
              ? "Перетягніть повзунок, щоб побачити різницю між чорновою стелею та фінішним преміум-результатом."
              : "Перетащите ползунок, чтобы увидеть разницу между черновым потолком и финишным премиум-результатом."}
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

      {/* Plaster vs Matte Stretch Ceiling Objection Crusher */}
      <section className={styles.objectionSection}>
        <div className={styles.objectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{isUk ? "ПОРІВНЯННЯ ТЕХНОЛОГІЙ" : "СРАВНЕНИЕ ТЕХНОЛОГИЙ"}</span>
            <h2 className={styles.sliderTitle}>
              {isUk ? "Класичний гіпсокартон чи матова стеля?" : "Классический гипсокартон или матовый потолок?"}
            </h2>
            <p className={styles.sliderSubtitle}>
              {isUk 
                ? "Чому провідні дизайнери інтер'єру повністю відмовляються від гіпсокартону на користь сучасних матових систем."
                : "Почему ведущие дизайнеры интерьера полностью отказываются от гипсокартона в пользу современных матовых систем."}
            </p>
          </div>

          <div className={styles.objectionTable}>
            {/* Table Header */}
            <div className={styles.tableRowHeader}>
              <div>{isUk ? "Критерій порівняння" : "Критерий сравнения"}</div>
              <div>{isUk ? "Гіпсокартон / Штукатурка" : "Гипсокартон / Штукатурка"}</div>
              <div>{isUk ? "Матова стеля Nova Stelya" : "Матовый потолок Nova Stelya"}</div>
            </div>

            {/* Row 1 */}
            <div className={styles.tableRow}>
              <div className={styles.criteriaName}>{isUk ? "Ризик тріщин" : "Риск трещин"}</div>
              <div className={styles.plasterCol}>
                <span className={styles.badIcon}>❌</span>
                <span>{isUk ? "Дуже високий. Будинок дає усадку, стики тріскаються через 1-2 роки." : "Очень высокий. Дом дает усадку, стыки трескаются через 1-2 года."}</span>
              </div>
              <div className={styles.premiumCol}>
                <span className={styles.goodIcon}>✓</span>
                <span>{isUk ? "Нульовий. Еластичне полотно нівелює будь-яку усадку будівлі." : "Нулевой. Эластичное полотно нивелирует любую усадку здания."}</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className={styles.tableRow}>
              <div className={styles.criteriaName}>{isUk ? "Бруд при монтажі" : "Грязь при монтаже"}</div>
              <div className={styles.plasterCol}>
                <span className={styles.badIcon}>❌</span>
                <span>{isUk ? "Тонни білого пилу від шліфування, шпаклівка на підлозі та стінах." : "Тонны белой пыли от шлифовки, шпаклевка на полу и стенах."}</span>
              </div>
              <div className={styles.premiumCol}>
                <span className={styles.goodIcon}>✓</span>
                <span>{isUk ? "Чистий безпиловий монтаж за 3 години з використанням пилососа." : "Чистый беспылевой монтаж за 3 часа с использованием пылесоса."}</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className={styles.tableRow}>
              <div className={styles.criteriaName}>{isUk ? "Захист від затоплення" : "Защита от затопления"}</div>
              <div className={styles.plasterCol}>
                <span className={styles.badIcon}>❌</span>
                <span>{isUk ? "Відсутній. При затопленні лист розбухає, жовтіє та потребує повної заміни." : "Отсутствует. При затоплении лист разбухает, желтеет и требует полной замены."}</span>
              </div>
              <div className={styles.premiumCol}>
                <span className={styles.goodIcon}>✓</span>
                <span>{isUk ? "Витримує до 100 л води на м². Воду можна злити, а стеля прийме колишню форму." : "Выдерживает до 100 л воды на м². Воду можно слить, а потолок примет прежнюю форму."}</span>
              </div>
            </div>

            {/* Row 4 */}
            <div className={styles.tableRow}>
              <div className={styles.criteriaName}>{isUk ? "Термін експлуатації" : "Срок эксплуатации"}</div>
              <div className={styles.plasterCol}>
                <span className={styles.badIcon}>❌</span>
                <span>{isUk ? "Потребує регулярного перефарбування кожні 3-5 років через потьмяніння." : "Требует регулярной перекраски каждые 3-5 лет из-за потускнения."}</span>
              </div>
              <div className={styles.premiumCol}>
                <span className={styles.goodIcon}>✓</span>
                <span>{isUk ? "Понад 25 років експлуатації без жодних змін кольору та структури." : "Более 25 лет эксплуатации без каких-либо изменений цвета и структуры."}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className={styles.pricingSection}>
        <div className={styles.pricingContainer}>
          <div className={styles.pricingHeader}>
            <span className={styles.sectionBadge}>{isUk ? "ТАРИФИ ТА КЛАСИ" : "ТАРИФЫ И КЛАССЫ"}</span>
            <h2 className={styles.sliderTitle}>
              {isUk ? "Прозорі тарифи на матеріали" : "Прозрачные тарифные планы"}
            </h2>
            <p className={styles.sliderSubtitle}>
              {isUk
                ? "Ми пропонуємо три класи екологічності та міцності полотна під будь-який дизайн-проект."
                : "Мы предлагаем три класса экологичности и прочности полотна под любой дизайн-проект."}
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
                <li>{isUk ? "Клас екологічності M1 (безпечно)" : "Класс экологичности M1 (безопасно)"}</li>
                <li>{isUk ? "Без неприємного запаху" : "Без неприятного запаха"}</li>
                <li>{isUk ? "Офіційна гарантія 10 років" : "Официальная гарантия 10 лет"}</li>
              </ul>
              <a href="#callback-form" className={styles.priceCardBtn}>{isUk ? "Обрати тариф" : "Выбрать тариф"}</a>
            </div>

            {/* Plan 2 */}
            <div className={`${styles.pricingCard} ${styles.pricingCardHighlighted}`}>
              <span className={styles.cardTagGold}>MATTE ECO-EXCLUSIVE</span>
              <h3>TEQTUM Euro</h3>
              <span className={styles.cardPrice}>{isUk ? "від 450 грн/м²" : "от 450 грн/м²"}</span>
              <ul className={styles.cardFeatures}>
                <li>{isUk ? "Повна пожежна безпека (ЄС KM2)" : "Полная пожарная безопасность (ЕС KM2)"}</li>
                <li>{isUk ? "Сертифікати екології REACH та RoHS" : "Сертификаты экологии REACH и RoHS"}</li>
                <li>{isUk ? "Ультра-міцне армування полотна" : "Ультра-прочное армирование полотна"}</li>
                <li>{isUk ? "Офіційна гарантія 15 років" : "Официальная гарантия 15 лет"}</li>
              </ul>
              <a href="#callback-form" className={styles.priceCardBtnGold}>{isUk ? "Обрати тариф" : "Выбрать тариф"}</a>
            </div>

            {/* Plan 3 */}
            <div className={styles.pricingCard}>
              <span className={styles.cardTag}>MATTE PREMIUM TEXTILE</span>
              <h3>DESCOR (Німеччина)</h3>
              <span className={styles.cardPrice}>{isUk ? "від 850 грн/м²" : "от 850 грн/м²"}</span>
              <ul className={styles.cardFeatures}>
                <li>{isUk ? "Преміальна тканинна основа" : "Премиальная тканевая основа"}</li>
                <li>{isUk ? "Повітропроникна «дихаюча» структура" : "Воздухопроницаемая «дышащая» структура"}</li>
                <li>{isUk ? "Морозостійкість матеріалу до -15°C" : "Морозоустойчивость материала до -15°C"}</li>
                <li>{isUk ? "Офіційна гарантія 20 років" : "Официальная гарантия 20 лет"}</li>
              </ul>
              <a href="#callback-form" className={styles.priceCardBtn}>{isUk ? "Обрати тариф" : "Выбрать тариф"}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Callback Box */}
      <section id="callback-form" className={styles.callbackSection}>
        <div className={styles.callbackContainer}>
          <div className={styles.callbackCard}>
            <div className={styles.callbackHeader}>
              <h2>{isUk ? "Отримайте точний розрахунок вартості" : "Получите точный расчет стоимости"}</h2>
              <p>
                {isUk
                  ? "Залиште контакти для виклику сертифікованого замірника з каталогами та зразками матеріалів. Замір безкоштовний у вашому місті."
                  : "Оставьте контакты для вызова сертифицированного замерщика с каталогами и образцами материалов. Замер бесплатный в вашем городе."}
              </p>
            </div>
            <form className={styles.callbackForm} onSubmit={(e) => { e.preventDefault(); alert(isUk ? "Дякуємо! З вами зв'яжуться." : "Спасибо! С вами свяжутся."); }}>
              <input type="text" placeholder={isUk ? "Ваше ім'я" : "Ваше имя"} className={styles.formInput} required />
              <input type="tel" placeholder={isUk ? "Номер телефону" : "Номер телефона"} className={styles.formInput} required />
              <button type="submit" className={styles.formSubmitBtn}>{isUk ? "Викликати замірника" : "Вызвать замерщика"}</button>
            </form>
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
