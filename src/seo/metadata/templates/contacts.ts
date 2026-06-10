import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";
import { SITE_NAME } from "@/seo/constants/site";

import { getCityPhrase } from "../../content/city-copy";

export function getContactsMetadata(ctx: SeoContext) {
  const { city, locale } = ctx;
  const isUk = locale === "uk";
  
  if (city) {
    const cityInCity = getCityPhrase(city.slug, locale);
    const cityPhone = city.phone;
    const cityAddress = isUk ? city.address : city.addressRu;

    return {
      title: buildTitle(
        isUk
          ? `Контакти компанії ${SITE_NAME} ${cityInCity} — телефон, адреса, замовлення стель`
          : `Контакты компании ${SITE_NAME} ${cityInCity} — телефон, адрес, заказ потолков`
      ),
      description: buildDescription(
        isUk
          ? `Зв'яжіться з представництвом компанії ${SITE_NAME} ${cityInCity}. Наша адреса: ${cityAddress}, телефон: ${cityPhone}. Безкоштовний замір стелі.`
          : `Свяжитесь с представительством компании ${SITE_NAME} ${cityInCity}. Наш адрес: ${cityAddress}, телефон: ${cityPhone}. Бесплатный замер потолка.`
      ),
      ogImageSlug: `contacts-${city.slug}`,
    };
  }

  return {
    title: buildTitle(
      isUk
        ? `Контакти компанії ${SITE_NAME} — телефони та адреси офісів в Україні`
        : `Контакты компании ${SITE_NAME} — телефоны и адреса офисов в Украине`
    ),
    description: buildDescription(
      isUk
        ? `Контакти виробника натяжних стель ${SITE_NAME} в Україні. Телефони гарячої лінії, адреси офісів у регіонах та режим роботи.`
        : `Контакты производителя натяжных потолков ${SITE_NAME} в Украине. Телефоны горячей линии, адреса офисов в регионах и режим работы.`
    ),
    ogImageSlug: "contacts",
  };
}
