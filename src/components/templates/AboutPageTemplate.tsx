import React from "react";
import { generatePageMetadata, SchemaScript } from "@/seo";
import { Badge, Card } from "@/components/ui";
import styles from "./AboutPageTemplate.module.css";

type AboutProps = {
  locale: "uk" | "ru";
};

export function AboutPageTemplate({ locale }: AboutProps) {
  const isUk = locale === "uk";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NOVA STELYA",
    "url": "https://novastelya.com",
    "logo": "https://novastelya.com/logo.png",
    "foundingDate": "2016",
    "knowsAbout": ["Натяжні стелі", "Монтаж стель", "Дизайн інтер'єру"],
  };

  return (
    <>
      <SchemaScript schema={orgSchema} />
      <section className={styles.aboutSec}>
        <div className="container">
          <div className={styles.header}>
            <Badge variant="gold">{isUk ? "Про компанію" : "О компании"}</Badge>
            <h1 className={`${styles.title} text-glow`}>
              {isUk ? "Золотий Стандарт Натяжних Стель" : "Золотой Стандарт Натяжных Потолков"}
            </h1>
            <p className={styles.subtitle}>
              {isUk
                ? "NOVA STELYA встановлює стелі преміум-якості з 2016 року. Наша мета — бездоганний результат."
                : "NOVA STELYA устанавливает потолки премиум-качества с 2016 года. Наша цель — безупречный результат."}
            </p>
          </div>

          {/* Company Story & Mission */}
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <h2>{isUk ? "Наша Історія" : "Наша История"}</h2>
              <p>
                {isUk
                  ? "Ми розпочали свій шлях у 2016 році як невелика команда ентузіастів. Сьогодні NOVA STELYA — це лідер ринку з представництвами у найбільших містах України. За 10 років роботи ми встановили понад 100 000 м² натяжних стель."
                  : "Мы начали свой путь в 2016 году как небольшая команда энтузиастов. Сегодня NOVA STELYA — это лидер рынка с представительствами в крупнейших городах Украины. За 10 лет работы мы установили более 100 000 м² натяжных потолков."}
              </p>
              <p>
                {isUk
                  ? "Ми постійно впроваджуємо передові технології монтажу (тіньові профілі EuroKraab, безщілинні системи, магнітні треки) та використовуємо тільки екологічно безпечні полотна провідних європейських брендів."
                  : "Мы постоянно внедряем передовые технологии монтажа (теневые профили EuroKraab, бесщелевые системы, магнитные треки) и используем только экологически безопасные полотна ведущих европейских брендов."}
              </p>
            </div>
            <div className={styles.stats}>
              <Card variant="premium" className={styles.statCard}>
                <span className={styles.statNum}>2016</span>
                <span className={styles.statLabel}>{isUk ? "Рік заснування" : "Год основания"}</span>
              </Card>
              <Card variant="premium" className={styles.statCard}>
                <span className={styles.statNum}>10+ {isUk ? "років" : "лет"}</span>
                <span className={styles.statLabel}>{isUk ? "Гарантії" : "Гарантии"}</span>
              </Card>
              <Card variant="premium" className={styles.statCard}>
                <span className={styles.statNum}>100k+ м²</span>
                <span className={styles.statLabel}>{isUk ? "Встановлено" : "Установлено"}</span>
              </Card>
            </div>
          </div>

          {/* Safety & Quality Standards (EEAT) */}
          <div className={styles.standards}>
            <h2 className={styles.sectionTitle}>
              {isUk ? "Наші Стандарти Якості (E-E-A-T)" : "Наши Стандарты Качества (E-E-A-T)"}
            </h2>
            <div className={styles.standardsGrid}>
              <Card hoverable className={styles.standardCard}>
                <span className={styles.standardIcon}>🛡️</span>
                <h3>{isUk ? "Сертифіковані полотна" : "Сертифицированные полотна"}</h3>
                <p>
                  {isUk
                    ? "Ми працюємо виключно з оригінальними полотнами Pongs (Німеччина), MSD Premium (Франція) та Teqtum (Німеччина), що мають європейські сертифікати пожежної безпеки та екологічності."
                    : "Мы работаем исключительно с оригинальными полотнами Pongs (Германия), MSD Premium (Франция) и Teqtum (Германия), имеющими европейские сертификаты пожарной безопасности и экологичности."}
                </p>
              </Card>
              <Card hoverable className={styles.standardCard}>
                <span className={styles.standardIcon}>💨</span>
                <h3>{isUk ? "Чистий монтаж без пилу" : "Чистый монтаж без пыли"}</h3>
                <p>
                  {isUk
                    ? "Всі монтажні бригади оснащені професійними пилососами та перфораторами з системою пиловідведення. Меблі та стіни залишаються бездоганно чистими."
                    : "Все монтажные бригады оснащены профессиональными пылесосами и перфораторами с системой пылеотвода. Мебель и стены остаются безупречно чистыми."}
                </p>
              </Card>
              <Card hoverable className={styles.standardCard}>
                <span className={styles.standardIcon}>🔥</span>
                <h3>{isUk ? "100% Безпечне обладнання" : "100% Безопасное оборудование"}</h3>
                <p>
                  {isUk
                    ? "Ми використовуємо тільки композитні вибухобезпечні газові балони європейського виробництва. Безпека вашого будинку — наш абсолютний пріоритет."
                    : "Мы используем только композитные взрывобезопасные газовые баллоны европейского производства. Безопасность вашего дома — наш абсолютный приоритет."}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
