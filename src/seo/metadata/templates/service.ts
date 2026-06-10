import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";
import { getServiceBySlug } from "@/config/services.config";

export function getServiceMetadata(ctx: SeoContext) {
  const { pageType, locale } = ctx;
  const isUk = locale === "uk";
  
  const service = getServiceBySlug(pageType);
  const serviceName = service ? service[locale].title : "";
  const serviceDesc = service ? service[locale].description : "";

  return {
    title: buildTitle(
      isUk
        ? `${serviceName} — ціна за м² з монтажем, фото, гарантія`
        : `${serviceName} — цена за м² с монтажом, фото, гарантия`
    ),
    description: buildDescription(
      isUk
        ? `${serviceName} під ключ по всій Україні від виробника. Ціна за м² з установкою, монтаж за 1 день, фото робіт, гарантія 10 років. Безкоштовний замір.`
        : `${serviceName} под ключ по всей Украине от производителя. Цена за м² с установкой, монтаж за 1 день, фото работ, гарантия 10 лет. Бесплатный замер.`
    ),
    ogImageSlug: pageType as string,
  };
}
