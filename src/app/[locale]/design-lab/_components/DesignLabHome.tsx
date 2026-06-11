"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./DesignLabHome.module.css";

type Props = {
  params: any;
};

type StylePreset = {
  id: string;
  titleUk: string;
  titleRu: string;
  descUk: string;
  descRu: string;
  priceUk: string;
  priceRu: string;
  image: string;
  featuresUk: string[];
  featuresRu: string[];
  link: string;
};

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "matte",
    titleUk: "Матові натяжні стелі",
    titleRu: "Матовые натяжные потолки",
    descUk: "Ефект бездоганно пофарбованої та оштукатуреної стелі. Ніякого блиску та спотворень світла. Ідеально біла матова текстура з рівномірним світлопоглинанням.",
    descRu: "Эффект безупречно покрашенного и оштукатуренного потолка. Никакого блеска и искажений света. Идеально белая матовая текстура с равномерным светопоглощением.",
    priceUk: "від 350 грн/м²",
    priceRu: "от 350 грн/м²",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800",
    featuresUk: ["Клас екологічності M1 (безпечно для дитячої)", "Повна відсутність неприємного запаху", "Довічна гарантія на монтаж від Nova Stelya"],
    featuresRu: ["Класс экологичности M1 (безопасно для детской)", "Полное отсутствие неприятного запаха", "Пожизненная гарантия на монтаж от Nova Stelya"],
    link: "/design-lab/matte-ceilings"
  },
  {
    id: "shadow",
    titleUk: "Тіньовий профіль Eurokraab",
    titleRu: "Теневой профиль Eurokraab",
    descUk: "Створює ефект стелі, що ширяє у повітрі, завдяки ідеально рівному тіньовому зазору 6 мм вздовж стін. Ніяких пластикових заглушок та багетів.",
    descRu: "Создает эффект парящего в воздухе потолка благодаря идеально ровному теневому зазору 6 мм вдоль стен. Никаких пластиковых заглушек и багетов.",
    priceUk: "від 550 грн/м²",
    priceRu: "от 550 грн/м²",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800",
    featuresUk: ["Ідеальний тіньовий зазор 6 мм", "Чітка геометрія внутрішніх та зовнішніх кутів", "Візуально збільшує простір кімнати"],
    featuresRu: ["Идеальный теневой зазор 6 мм", "Четкая геометрия внутренних и внешних углов", "Визуально увеличивает пространство комнаты"],
    link: "/design-lab/matte-ceilings"
  },
  {
    id: "lines",
    titleUk: "Інтегровані світлові лінії",
    titleRu: "Интегрированные световые линии",
    descUk: "Сучасне дизайнерське освітлення, вмонтоване в один рівень із полотном стелі. Замінює класичні громіздкі люстри та візуально зонує приміщення.",
    descRu: "Современное дизайнерское освещение, вмонтированное в один уровень с полотном потолка. Заменяет классические громоздкие люстры и визуально зонирует помещение.",
    priceUk: "від 800 грн/м",
    priceRu: "от 800 грн/м",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800",
    featuresUk: ["Енергоефективні LED-стрічки класу Premium", "Рівномірний розсіювач без видимих точок світла", "Сумісність з системами Smart Home (диммирование)"],
    featuresRu: ["Энергоэффективные LED-ленты класса Premium", "Равномерный рассеиватель без видимых точек света", "Совместимость с системами Smart Home (диммирование)"],
    link: "/design-lab/matte-ceilings"
  }
];

export function DesignLabHome({ params }: Props) {
  const locale = "uk"; // Default for design lab showcase
  const isUk = locale === "uk";

  const [activeTab, setActiveTab] = useState<string>("matte");
  const currentPreset = STYLE_PRESETS.find((p) => p.id === activeTab) || STYLE_PRESETS[0];

  // Client leads form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      setFormSubmitted(true);
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

      {/* Hero Section (Editorial Luxury) */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroInfo}>
              <span className={styles.conceptBadge}>
                {isUk ? "ШЕДЕВРИ СТЕЛЬОВОГО ДИЗАЙНУ" : "ШЕДЕВРЫ ПОТОЛОЧНОГО ДИЗАЙНА"}
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
                  ? "Безщілинний монтаж за німецьким стандартом Eurokraab. Ідеально плоскі поверхні, інтегроване освітлення та довічна гарантія на роботу. Ми створюємо архітектурні інтер'єри, які підвищують статус вашої оселі."
                  : "Бесщелевой монтаж по немецкому стандарту Eurokraab. Идеально плоские поверхности, интегрированное освещение и пожизненная гарантия на работу. Мы создаем архитектурные интерьеры, повышающие статус вашего дома."}
              </p>
              
              {/* Trust Indicators Stats Bar */}
              <div className={styles.trustStatsBar}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>12,480+</span>
                  <span className={styles.statLabel}>{isUk ? "зданих об'єктів" : "сданных объектов"}</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <div className={styles.ratingBox}>
                    <span className={styles.statValue}>4.9</span>
                    <span className={styles.stars}>★★★★★</span>
                  </div>
                  <span className={styles.statLabel}>{isUk ? "1,200+ відгуків" : "1,200+ отзывов"}</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <span className={styles.statValue}>100%</span>
                  <span className={styles.statLabel}>{isUk ? "чистий монтаж" : "чистый монтаж"}</span>
                </div>
              </div>

              <div className={styles.heroActions}>
                <a href="#matcher" className={styles.ctaPrimary}>
                  <span>{isUk ? "Обрати свій стиль" : "Выбрать свой стиль"}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a href="#callback-box" className={styles.ctaSecondary}>
                  {isUk ? "Замовити консультацію" : "Заказать консультацию"}
                </a>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.visualCard}>
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200"
                  alt="Premium interior ceiling design by Nova Stelya"
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

      {/* Interactive Style Matcher (Interactive Conversion Element) */}
      <section id="matcher" className={styles.matcherSection}>
        <div className={styles.matcherContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{isUk ? "КОНФІГУРАТОР СТИЛЮ" : "КОНФИГУРАТОР СТИЛЯ"}</span>
            <h2 className={styles.sectionTitle}>
              {isUk ? "Знайдіть ідеальну стелю для вашого інтер'єру" : "Найдите идеальный потолок для вашего интерьера"}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isUk
                ? "Оберіть тип рішення, щоб побачити орієнтовну вартість, детальні переваги та візуальний приклад."
                : "Выберите тип решения, чтобы увидеть ориентировочную стоимость, детальные преимущества и визуальный пример."}
            </p>
          </div>

          <div className={styles.matcherTabs}>
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`${styles.tabBtn} ${activeTab === preset.id ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(preset.id)}
              >
                {isUk ? preset.titleUk : preset.titleRu}
              </button>
            ))}
          </div>

          <div className={styles.matcherContentCard}>
            <div className={styles.matcherImgBox}>
              <img
                src={currentPreset.image}
                alt={isUk ? currentPreset.titleUk : currentPreset.titleRu}
                className={styles.matcherImg}
              />
            </div>
            <div className={styles.matcherDetails}>
              <span className={styles.matcherPriceBadge}>
                {isUk ? currentPreset.priceUk : currentPreset.priceRu}
              </span>
              <h3>{isUk ? currentPreset.titleUk : currentPreset.titleRu}</h3>
              <p className={styles.matcherDesc}>
                {isUk ? currentPreset.descUk : currentPreset.descRu}
              </p>
              
              <ul className={styles.matcherFeaturesList}>
                {(isUk ? currentPreset.featuresUk : currentPreset.featuresRu).map((feat, index) => (
                  <li key={index}>
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.matcherActions}>
                <Link href={currentPreset.link} className={styles.ctaPrimary}>
                  {isUk ? "Детальний розбір технології" : "Детальный разбор технологии"}
                </Link>
                <a href="#callback-box" className={styles.ctaSecondary}>
                  {isUk ? "Зафіксувати ціну" : "Зафиксировать цену"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Perfect vs. Cheap" Comparison Grid (Conversion Psychology) */}
      <section className={styles.comparisonSection}>
        <div className={styles.comparisonContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{isUk ? "УВАГА НА ДЕТАЛІ" : "ВНИМАНИЕ НА ДЕТАЛИ"}</span>
            <h2 className={styles.sectionTitle}>
              {isUk ? "Чому дешевий монтаж коштує вдвічі дорожче?" : "Почему дешевый монтаж стоит вдвое дороже?"}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isUk
                ? "Порівняння наслідків кустарної роботи та професійного інженерного монтажу від Nova Stelya."
                : "Сравнение последствий кустарной работы и профессионального инженерного монтажа от Nova Stelya."}
            </p>
          </div>

          <div className={styles.comparisonGrid}>
            {/* Cheap installation warning card */}
            <div className={`${styles.compareCard} ${styles.compareCardCheap}`}>
              <div className={styles.compareHeader}>
                <span className={styles.compareBadge}>{isUk ? "ШИРПОТРЕБ / ДЕШЕВО" : "ШИРПОТРЕБ / ДЕШЕВО"}</span>
                <h3>{isUk ? "Типова кустарна робота" : "Типичная кустарная работа"}</h3>
              </div>
              <ul className={styles.compareList}>
                <li>
                  <span className={styles.compareCross}>✕</span>
                  <div>
                    <strong>{isUk ? "Пластикова заглушка вздовж стін:" : "Пластиковая заглушка вдоль стен:"}</strong>
                    <p>{isUk ? "З часом жовтіє, випадає з пазів та створює дешевий вигляд офісу з 90-х." : "Со временем желтеет, выпадает из пазов и создает дешевый вид офиса из 90-х."}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.compareCross}>✕</span>
                  <div>
                    <strong>{isUk ? "Токсичні матеріали (ПВХ):" : "Токсичные материалы (ПВХ):"}</strong>
                    <p>{isUk ? "Різкий хімічний запах пластику, який не вивітрюється тижнями та викликає головний біль." : "Резкий химический запах пластика, который не выветривается неделями и вызывает головную боль."}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.compareCross}>✕</span>
                  <div>
                    <strong>{isUk ? "Провисання та зморшки:" : "Провисание и складки:"}</strong>
                    <p>{isUk ? "Поганий розігрів та слабкий профіль призводять до провисання стелі вже за перший рік." : "Плохой разогрев и слабый профиль приводят к провисанию потолка уже за первый год."}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.compareCross}>✕</span>
                  <div>
                    <strong>{isUk ? "Майстри «без гарантії»:" : "Мастера «без гарантии»:"}</strong>
                    <p>{isUk ? "Жодних офіційних договорів. У разі затоплення чи тріщини телефон майстра буде поза зоною." : "Никаких официальных договоров. В случае затопления или трещины телефон мастера будет вне зоны."}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Premium installation card */}
            <div className={`${styles.compareCard} ${styles.compareCardPremium}`}>
              <div className={styles.compareHeader}>
                <span className={styles.compareBadge}>{isUk ? "НОВА СТЕЛЯ СТАНДАРТ" : "НОВА СТЕЛЯ СТАНДАРТ"}</span>
                <h3>{isUk ? "Преміальний стандарт монтажу" : "Премиальный стандарт монтажа"}</h3>
              </div>
              <ul className={styles.compareList}>
                <li>
                  <span className={styles.compareCheck}>✓</span>
                  <div>
                    <strong>{isUk ? "Сучасний тіньовий шов Eurokraab:" : "Современный теневой шов Eurokraab:"}</strong>
                    <p>{isUk ? "Ідеально рівний мікро-зазор 6 мм між стіною та стелею. Жодних вставок та плінтусів." : "Идеально ровный микро-зазор 6 мм между стеной и потолком. Никаких вставок и плинтусов."}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.compareCheck}>✓</span>
                  <div>
                    <strong>{isUk ? "Екологічні сертифікати Teqtum:" : "Экологические сертификаты Teqtum:"}</strong>
                    <p>{isUk ? "Європейські полотна без запаху. Повна пожежна безпека та захист від алергії." : "Европейские полотна без запаха. Полная пожарная безопасность и защита от аллергии."}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.compareCheck}>✓</span>
                  <div>
                    <strong>{isUk ? "Посилена алюмінієва арматура:" : "Усиленная алюминиевая арматура:"}</strong>
                    <p>{isUk ? "Надійний каркас витримує натяг понад 100 кг на м² та захищає від будь-якого провисання." : "Надежный каркас выдерживает натяжение свыше 100 кг на м² и защищает от любого провисания."}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.compareCheck}>✓</span>
                  <div>
                    <strong>{isUk ? "Офіційна гарантія та сервіс:" : "Официальная гарантия и сервис:"}</strong>
                    <p>{isUk ? "Договір з печаткою, довічна гарантія на роботу та власна служба сервісу 24/7." : "Договор с печатью, пожизненная гарантия на работу и собственная служба сервиса 24/7."}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Real Realized Cases & Social Proof */}
      <section className={styles.casesSection}>
        <div className={styles.casesContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{isUk ? "ПОРТФОЛІО" : "ПОРТФОЛИО"}</span>
            <h2 className={styles.sectionTitle}>
              {isUk ? "Реалізовані об'єкти бізнес- та преміум класу" : "Реализованные объекты бизнес- и премиум класса"}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isUk
                ? "Подивіться, як наші стелі виглядають у реальних інтер'єрах після завершення всіх робіт."
                : "Посмотрите, как наши потолки выглядят в реальных интерьерах после завершения всех работ."}
            </p>
          </div>

          <div className={styles.casesGrid}>
            {/* Case 1 */}
            <div className={styles.caseCard}>
              <div className={styles.caseImgBox}>
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600"
                  alt="Living room shadow ceiling design"
                  className={styles.caseImg}
                />
                <span className={styles.caseBadge}>KYIV · 2026</span>
              </div>
              <div className={styles.caseContent}>
                <h4>{isUk ? "Вітальня в стилі Modern Minimal" : "Гостиная в стиле Modern Minimal"}</h4>
                <span className={styles.caseSpecs}>
                  {isUk ? "Площа: 42 м² · Час монтажу: 5 годин · Профіль: Eurokraab" : "Площадь: 42 м² · Время монтажа: 5 часов · Профиль: Eurokraab"}
                </span>
                <p className={styles.caseQuote}>
                  {isUk
                    ? "«Стеля виглядає неймовірно рівно, наче дорога фарбована гіпсова плита. Тіньовий зазор робить кімнату візуально вищою. Дуже задоволений!»"
                    : "«Потолок выглядит невероятно ровно, как дорогая крашеная гипсовая плита. Теневой зазор делает комнату визуально выше. Очень доволен!»"}
                </p>
                <span className={styles.caseAuthor}>{isUk ? "— Олексій, ЖК «Новопечерські Липки»" : "— Алексей, ЖК «Новопечерские Липки»"}</span>
              </div>
            </div>

            {/* Case 2 */}
            <div className={styles.caseCard}>
              <div className={styles.caseImgBox}>
                <img
                  src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=600"
                  alt="Bedroom light lines design"
                  className={styles.caseImg}
                />
                <span className={styles.caseBadge}>ODESA · 2026</span>
              </div>
              <div className={styles.caseContent}>
                <h4>{isUk ? "Спальня з інтегрованими лініями" : "Спальня с интегрированными линиями"}</h4>
                <span className={styles.caseSpecs}>
                  {isUk ? "Площа: 18 м² · Час монтажу: 3 години · Світло: Premium LED" : "Площадь: 18 м² · Время монтажа: 3 часа · Свет: Premium LED"}
                </span>
                <p className={styles.caseQuote}>
                  {isUk
                    ? "«Повністю відмовилися від люстри. Світлові лінії дають ідеальне м'яке та яскраве світло, дуже зручно керувати з телефона. Дякую Nova Stelya!»"
                    : "«Полностью отказались от люстры. Световые линии дают идеальный мягкий и яркий свет, очень удобно управлять с телефона. Спасибо Nova Stelya!»"}
                </p>
                <span className={styles.caseAuthor}>{isUk ? "— Марія, ЖК «Південний»" : "— Мария, ЖК «Южный»"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Callback / Lead Conversion Box */}
      <section id="callback-box" className={styles.callbackSection}>
        <div className={styles.callbackContainer}>
          <div className={styles.callbackCard}>
            <div className={styles.callbackHeader}>
              <h2>{isUk ? "Отримайте безкоштовний 3D-проект вашої стелі" : "Получите бесплатный 3D-проект вашего потолка"}</h2>
              <p>
                {isUk
                  ? "Залиште заявку, і наш дизайнер безкоштовно розробить 3D-візуалізацію стелі та підбере ідеальне освітлення під ваш інтер'єр."
                  : "Оставьте заявку, и наш дизайнер бесплатно разработает 3D-визуализацию потолка и подберет идеальное освещение под ваш интерьер."}
              </p>
            </div>

            {formSubmitted ? (
              <div className={styles.successMessage}>
                <h3>{isUk ? "Дякуємо! Заявку прийнято" : "Спасибо! Заявка принята"}</h3>
                <p>
                  {isUk
                    ? "Наш спеціаліст зв'яжеться з вами протягом 10 хвилин для уточнення деталей."
                    : "Наш специалист свяжется с вами в течение 10 минут для уточнения деталей."}
                </p>
              </div>
            ) : (
              <form className={styles.callbackForm} onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={isUk ? "Ваше ім'я" : "Ваше имя"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.formInput}
                />
                <input
                  type="tel"
                  placeholder={isUk ? "Номер телефону" : "Номер телефона"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={styles.formInput}
                />
                <button type="submit" className={styles.formSubmitBtn}>
                  {isUk ? "Отримати проект безкоштовно" : "Получить проект бесплатно"}
                </button>
              </form>
            )}
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
