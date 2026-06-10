import React from "react";
import Link from "next/link";
import { SchemaScript } from "@/seo";
import { Badge, Card, Button } from "@/components/ui";
import { blogArticles } from "@/config/blog.config";
import styles from "./BlogPageTemplate.module.css";

type BlogProps = {
  locale: "uk" | "ru";
};

export function BlogPageTemplate({ locale }: BlogProps) {
  const isUk = locale === "uk";
  const navPrefix = locale === "ru" ? "/ru" : "";

  // BlogList schema
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": isUk ? "Блог NOVA STELYA" : "Блог NOVA STELYA",
    "description": isUk
      ? "Корисні статті та поради про натяжні стелі"
      : "Полезные статьи и советы о натяжных потолках",
    "blogPost": blogArticles.map((article) => ({
      "@type": "BlogPosting",
      "headline": isUk ? article.titleUk : article.titleRu,
      "description": isUk ? article.descUk : article.descRu,
      "datePublished": article.date,
      "author": {
        "@type": "Person",
        "name": article.author,
      },
    })),
  };

  return (
    <>
      <SchemaScript schema={blogListSchema} />
      <section className={styles.blogSec}>
        <div className="container">
          <div className={styles.header}>
            <Badge variant="gold">{isUk ? "Наш Блог" : "Наш Блог"}</Badge>
            <h1 className={`${styles.title} text-glow`}>
              {isUk ? "Корисні Статті та Поради" : "Полезные Статьи и Советы"}
            </h1>
            <p className={styles.subtitle}>
              {isUk
                ? "Дізнайтеся більше про сучасні тенденції в дизайні натяжних стель, тонкощі вибору та особливості монтажу."
                : "Узнайте больше о современных тенденциях в дизайне натяжных потолков, тонкостях выбора и особенностях монтажа."}
            </p>
          </div>

          <div className={styles.grid}>
            {blogArticles.map((article) => (
              <Card key={article.slug} variant="premium" className={styles.articleCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.date}>📅 {article.date}</span>
                  <span className={styles.readTime}>
                    ⏱️ {isUk ? article.readTimeUk : article.readTimeRu}
                  </span>
                </div>
                <h3>{isUk ? article.titleUk : article.titleRu}</h3>
                <p className={styles.desc}>{isUk ? article.descUk : article.descRu}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.author}>✍️ {article.author}</span>
                  <Link href={`${navPrefix}/blog/${article.slug}`}>
                    <Button variant="secondary" size="sm">
                      {isUk ? "Читати далі" : "Читать далее"}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
