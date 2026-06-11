"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./DesignLabHome.module.css";

type Props = {
  params: any;
};

export function DesignLabHome({ params }: Props) {
  // Use React.use() if params is a Promise, or standard destructuring
  const locale = "uk"; // Default for design lab showcase

  const isUk = locale === "uk";

  const [activeCard, setActiveCard] = useState<number | null>(null);

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
            <Link href="/design-lab" className={`${styles.navLink} ${styles.navLinkActive}`}>
              {isUk ? "Головна (Варіант)" : "Главная (Вариант)"}
            </Link>
            <Link href="/design-lab/matte-ceilings" className={styles.navLink}>
              {isUk ? "Матові стелі (Варіант)" : "Матовые потолки (Вариант)"}
            </Link>
            <Link href="/" className={styles.backLink}>
              {isUk ? "← На бойовий сайт" : "← На боевой сайт"}
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          {/* Asymmetric Content Layout */}
          <div className={styles.heroGrid}>
            <div className={styles.heroInfo}>
              <span className={styles.conceptBadge}>
                {isUk ? "НОВА ЕРА ДИЗАЙНУ" : "НОВАЯ ЭРА ДИЗАЙНА"}
              </span>
              <h1 className={styles.heroTitle}>
                {isUk ? (
                  <>
                    Стелі як <span className={styles.goldText}>мистецтво</span> інженерної точності
                  </>
                ) : (
                  <>
                    Потолки как <span className={styles.goldText}>искусство</span> инженерной точности
                  </>
                )}
              </h1>
              <p className={styles.heroDesc}>
                {isUk
                  ? "Ми переосмислили дизайн натяжних стель в Україні. Поєднання бездоганного монтажу без щілин та преміальних світлових рішень, спроектованих за європейськими стандартами."
                  : "Мы переосмыслили дизайн натяжных потолков в Украине. Сочетание безупречного бесщелевого монтажа и премиальных световых решений, спроектированных по европейским стандартам."}
              </p>
              <div className={styles.heroActions}>
                <a href="#calculator" className={styles.ctaPrimary}>
                  <span>{isUk ? "Розрахувати вартість" : "Рассчитать стоимость"}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a href="#showcase" className={styles.ctaSecondary}>
                  {isUk ? "Галерея проектів" : "Галерея проектов"}
                </a>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.visualCard}>
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                  alt="Premium interior ceiling design"
                  className={styles.visualImg}
                />
                <div className={styles.visualOverlay} />
                <div className={styles.visualBadge}>
                  <div className={styles.badgePulse} />
                  <span>{isUk ? "Преміальний Eurokraab" : "Премиальный Eurokraab"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid with :has() selector layout */}
      <section id="showcase" className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {isUk ? "Естетика рішень" : "Эстетика решений"}
          </h2>
          <p className={styles.sectionSubtitle}>
            {isUk
              ? "Кожна категорія — це окремий інженерний вузол, доведений до досконалості."
              : "Каждая категория — это отдельный инженерный узел, доведенный до совершенства."}
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {/* Card 1 */}
          <div 
            className={`${styles.serviceCard} ${activeCard === 1 ? styles.cardExpanded : ""}`}
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
          >
            <div className={styles.cardBg}>
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800" alt="Matte ceiling" />
              <div className={styles.cardGradient} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCategory}>{isUk ? "Матеріали" : "Материалы"}</span>
              <h3 className={styles.cardTitle}>{isUk ? "Матові стелі" : "Матовые потолки"}</h3>
              <p className={styles.cardDesc}>
                {isUk 
                  ? "Класична ідеально рівна поверхня без жодного бліку. Ефект дорогої гіпсової штукатурки." 
                  : "Классическая идеально ровная поверхность без единого блика. Эффект дорогой гипсовой штукатурки."}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>{isUk ? "від 350 грн/м²" : "от 350 грн/м²"}</span>
                <span className={styles.cardCta}>{isUk ? "Детальніше" : "Подробнее"} →</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className={`${styles.serviceCard} ${activeCard === 2 ? styles.cardExpanded : ""}`}
            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
          >
            <div className={styles.cardBg}>
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800" alt="Shadow ceiling" />
              <div className={styles.cardGradient} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCategory}>{isUk ? "Технології" : "Технологии"}</span>
              <h3 className={styles.cardTitle}>{isUk ? "Тіньовий профіль" : "Теневой профиль"}</h3>
              <p className={styles.cardDesc}>
                {isUk 
                  ? "Створює ефект стелі, що ширяє у повітрі, завдяки ідеальному тіньовому зазору 6 мм вздовж стін." 
                  : "Создает эффект парящего в воздухе потолка благодаря идеальному теневому зазору 6 мм вдоль стен."}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>{isUk ? "від 550 грн/м²" : "от 550 грн/м²"}</span>
                <span className={styles.cardCta}>{isUk ? "Детальніше" : "Подробнее"} →</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className={`${styles.serviceCard} ${activeCard === 3 ? styles.cardExpanded : ""}`}
            onClick={() => setActiveCard(activeCard === 3 ? null : 3)}
          >
            <div className={styles.cardBg}>
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800" alt="Light lines" />
              <div className={styles.cardGradient} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCategory}>{isUk ? "Освітлення" : "Освещение"}</span>
              <h3 className={styles.cardTitle}>{isUk ? "Світлові лінії" : "Световые линии"}</h3>
              <p className={styles.cardDesc}>
                {isUk 
                  ? "Інтегровані в площину стелі світлові смуги. Сучасна заміна класичним люстрам." 
                  : "Интегрированные в плоскость потолка световые полосы. Современная замена классическим люстрам."}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>{isUk ? "від 800 грн/м" : "от 800 грн/м"}</span>
                <span className={styles.cardCta}>{isUk ? "Детальніше" : "Подробнее"} →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Container Query Demonstration */}
      <section className={styles.containerSection}>
        <div className={styles.containerIntro}>
          <span className={styles.introBadge}>CSS CONTAINER QUERIES</span>
          <h2 className={styles.containerTitle}>
            {isUk ? "Адаптивна архітектура компонентів" : "Адаптивная архитектура компонентов"}
          </h2>
          <p className={styles.containerDesc}>
            {isUk
              ? "Нижче наведено один і той самий компонент картки, розміщений у контейнерах різної ширини. Він адаптує свій внутрішній макет (сітку, шрифти, відступи) самостійно, без використання медіа-запитів viewport."
              : "Ниже представлен один и тот же компонент карточки, размещенный в контейнерах разной ширины. Он адаптирует свой внутренний макет (сетку, шрифты, отступы) самостоятельно, без использования медиа-запросов viewport."}
          </p>
        </div>

        {/* Demo container blocks */}
        <div className={styles.demoLayout}>
          <div className={styles.demoBoxWide}>
            <span className={styles.boxLabel}>{isUk ? "Контейнер 100% ширини (Десктопний макет)" : "Контейнер 100% ширины (Десктопный макет)"}</span>
            <div className={styles.cardContainer}>
              <div className={styles.adaptiveCard}>
                <div className={styles.adaptiveCardImg}>
                  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400" alt="Eurokraab ceiling" />
                </div>
                <div className={styles.adaptiveCardBody}>
                  <span className={styles.adaptiveCardTag}>{isUk ? "Преміум рішення" : "Премиум решение"}</span>
                  <h3>{isUk ? "Тіньова натяжна стеля Eurokraab" : "Теневой натяжной потолок Eurokraab"}</h3>
                  <p>
                    {isUk
                      ? "Спеціальна алюмінієва профільна система створює рівний геометричний тіньовий зазор 6 мм між стіною та площиною стелі. Ніяких пластикових заглушок та плінтусів."
                      : "Специальная алюминиевая профильная система создает ровный геометрический теневой зазор 6 мм между стеной и плоскостью потолка. Никаких пластиковых заглушек и плинтусов."}
                  </p>
                  <button className={styles.adaptiveCardButton}>{isUk ? "Дізнатися більше" : "Узнать больше"}</button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.demoBoxNarrow}>
            <span className={styles.boxLabel}>{isUk ? "Вузький контейнер 40% (Мобільний макет)" : "Узкий контейнер 40% (Мобильный макет)"}</span>
            <div className={styles.cardContainer}>
              <div className={styles.adaptiveCard}>
                <div className={styles.adaptiveCardImg}>
                  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400" alt="Eurokraab ceiling" />
                </div>
                <div className={styles.adaptiveCardBody}>
                  <span className={styles.adaptiveCardTag}>{isUk ? "Преміум рішення" : "Премиум решение"}</span>
                  <h3>{isUk ? "Тіньова натяжна стеля Eurokraab" : "Теневой натяжной потолок Eurokraab"}</h3>
                  <p>
                    {isUk
                      ? "Спеціальна алюмінієва профільна система створює рівний геометричний тіньовий зазор 6 мм між стіною та площиною стелі. Ніяких пластикових заглушок та плінтусів."
                      : "Специальная алюминиевая профильная система создает ровный геометрический теневой зазор 6 мм между стеной и плоскостью потолка. Никаких пластиковых заглушек и плинтусов."}
                  </p>
                  <button className={styles.adaptiveCardButton}>{isUk ? "Дізнатися більше" : "Узнать больше"}</button>
                </div>
              </div>
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
