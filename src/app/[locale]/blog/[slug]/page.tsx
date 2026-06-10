import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { blogArticles } from "@/config/blog.config";
import { generatePageMetadata, SchemaScript, buildArticleSchema, buildBreadcrumbSchema } from "@/seo";
import { Badge, Button } from "@/components/ui";
import Link from "next/link";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return {};

  return generatePageMetadata({
    page: "blog",
    slug: article.slug,
    locale: locale as "uk" | "ru",
    overrides: {
      title: `${isUk(locale) ? article.titleUk : article.titleRu} — NOVA STELYA`,
      description: isUk(locale) ? article.descUk : article.descRu,
    }
  });
}

function isUk(locale: string): boolean {
  return locale === "uk";
}

export function generateStaticParams() {
  const locales = ["uk", "ru"];
  return locales.flatMap((locale) =>
    blogArticles.map((article) => ({
      locale,
      slug: article.slug,
    }))
  );
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const isUkLang = isUk(locale);
  const title = isUkLang ? article.titleUk : article.titleRu;
  const desc = isUkLang ? article.descUk : article.descRu;
  const navPrefix = locale === "ru" ? "/ru" : "";

  // 1. Build Article Schema
  const articleSchema = buildArticleSchema({
    title,
    description: desc,
    url: `https://novastelya.com${locale === "ru" ? "/ru" : ""}/blog/${article.slug}`,
    imageUrl: `https://novastelya.com/images/blog/${article.slug}.jpg`,
    datePublished: article.date,
    dateModified: article.date,
    authorName: article.author,
  });

  // 2. Build Breadcrumbs Schema
  const breadcrumbs = [
    { name: isUkLang ? "Головна" : "Главная", url: "/" },
    { name: isUkLang ? "Блог" : "Блог", url: "/blog" },
    { name: title, url: `/blog/${article.slug}` }
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  // Expanded dummy text for E-E-A-T value and content richness
  const contentUk = (
    <div className={styles.articleBody}>
      <p>
        Оздоблення стелі — важливий етап у ремонті будь-якого приміщення. Сьогодні натяжні стелі є найпопулярнішим вибором завдяки швидкості монтажу, надійності та бездоганній естетиці. Однак перед кожним власником житла постає питання: які профілі та матеріали обрати для досягнення ідеального результату?
      </p>
      <h2>Основні фактори вибору</h2>
      <p>
        Обираючи полотно, слід зважати на тип приміщення. Наприклад, для кухні чи ванної кімнати найкраще підійде практична ПВХ плівка, оскільки вона не боїться вологості, пари та легко очищається. У спальні або вітальні чудово виглядають матові тканинні матеріали чи сатиновий відлив, що створює затишну та спокійну атмосферу.
      </p>
      <blockquote>
        Важливо: купуйте лише оригінальні полотна європейських брендів із відповідними сертифікатами безпеки (MSD Premium, Pongs, Teqtum).
      </blockquote>
      <h2>Поради експерта</h2>
      <p>
        Звертайте увагу на систему монтажу. Тіньові профілі EuroKraab створюють унікальний зазор між стіною та стелею, який виглядає надзвичайно стильно в мінімалістичних інтер'єрах. Також подбайте про сучасне освітлення — інтегруйте вбудовані світлові лінії або магнітні трекові системи.
      </p>
    </div>
  );

  const contentRu = (
    <div className={styles.articleBody}>
      <p>
        Отделка потолка — важный этап в ремонте любого помещения. Сегодня натяжные потолки являются самым популярным выбором благодаря скорости монтажа, надежности и безупречной эстетике. Однако перед каждым владельцем жилья встает вопрос: какие профили и материалы выбрать для достижения идеального результата?
      </p>
      <h2>Основные факторы выбора</h2>
      <p>
        Выбирая полотно, следует учитывать тип помещения. Например, для кухни или ванной комнаты лучше всего подойдет практичная ПВХ пленка, поскольку она не боится влажности, пара и легко очищается. В спальне или гостиной отлично смотрятся матовые тканевые материалы или сатиновый отлив, создающий уютную и спокойную атмосферу.
      </p>
      <blockquote>
        Важно: приобретайте только оригинальные полотна европейских брендов с соответствующими сертификатами безопасности (MSD Premium, Pongs, Teqtum).
      </blockquote>
      <h2>Советы эксперта</h2>
      <p>
        Обращайте внимание на систему монтажа. Теневые профили EuroKraab создают уникальный зазор между стеной и потолком, который выглядит чрезвычайно стильно в минималистичных интерьерах. Также позаботьтесь о современном освещении — интегрируйте встроенные световые линии или магнитные трековые системы.
      </p>
    </div>
  );

  return (
    <>
      <SchemaScript schema={[articleSchema, breadcrumbSchema]} />
      <article className={styles.articleSec}>
        <div className="container">
          <div className={styles.header}>
            <Link href={`${navPrefix}/blog`}>
              <Button variant="outline" size="sm" className={styles.backBtn}>
                {isUkLang ? "← Назад до блогу" : "← Назад в блог"}
              </Button>
            </Link>
            <div className={styles.meta}>
              <span>📅 {article.date}</span>
              <span>✍️ {article.author}</span>
            </div>
            <h1 className={styles.title}>{title}</h1>
          </div>

          <div className={styles.content}>
            {isUkLang ? contentUk : contentRu}
          </div>
        </div>
      </article>
    </>
  );
}
