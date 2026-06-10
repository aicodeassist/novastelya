import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";

export function getBlogListMetadata(ctx: SeoContext) {
  const { locale } = ctx;
  const isUk = locale === "uk";
  
  return {
    title: buildTitle(
      isUk
        ? "Блог про натяжні стелі — поради щодо вибору, монтажу та догляду"
        : "Блог о натяжных потолках — советы по выбору, монтажу и уходу"
    ),
    description: buildDescription(
      isUk
        ? "Корисні статті, огляди та поради експертів про натяжні стелі. Дізнайтеся, як вибрати фактуру, яке підібрати освітлення та як доглядати за полотном."
        : "Полезные статьи, обзоры и советы экспертов о натяжных потолках. Узнайте, как выбрать фактуру, какое подобрать освещение и как ухаживать за полотном."
    ),
    ogImageSlug: "blog",
  };
}
