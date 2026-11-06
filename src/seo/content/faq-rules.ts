import type { CityConfig } from "@/config/geo-matrix";
import type { Locale } from "@/config/locales.config";
import type { FAQItem } from "@/seo/types/schema.types";
import { getCityPhrase } from "@/seo/content/city-copy";

export function getServiceFAQ(
  serviceName: string,
  locale: Locale,
  city?: CityConfig | null,
  basePrice = 280
): FAQItem[] {
  const isUk = locale === "uk";
  const finalPrice = city ? Math.round(basePrice * city.priceModifier) : basePrice;
  const phone = city?.phone ?? "0 800 000-000";
  
  const cityInCity = city
    ? getCityPhrase(city.slug, locale) || (isUk ? `у ${city.uk}` : `в ${city.ru}`)
    : (isUk ? "в Україні" : "в Украине");

  return [
    {
      q: isUk
        ? `Яка різниця між матовою та сатинованою стелею?`
        : `В чём разница между матовым и сатиновым потолком?`,
      a: isUk
        ? `Матова стеля поглинає світло і приховує нерівності. Сатинова — має легкий блиск і візуально збільшує простір.`
        : `Матовый потолок поглощает свет и скрывает неровности. Сатиновый — имеет лёгкий блеск и визуально увеличивает пространство.`,
    },
    {
      q: isUk
        ? `Скільки коштує ${serviceName.toLowerCase()} ${cityInCity}?`
        : `Сколько стоит ${serviceName.toLowerCase()} ${cityInCity}?`,
      a: isUk
        ? `Вартість становить від ${finalPrice} грн за м² з урахуванням монтажних робіт. Точний розрахунок — безкоштовний замір: ${phone}.`
        : `Стоимость составляет от ${finalPrice} грн за м² с учетом монтажных работ. Точный расчет — бесплатный замер: ${phone}.`,
    },
    {
      q: isUk
        ? `Скільки часу займає монтаж?`
        : `Сколько времени занимает монтаж?`,
      a: isUk
        ? `Монтаж натяжної стелі у стандартній кімнаті займає близько 1–3 годин. Увесь процес проходить без пилу та бруду.`
        : `Монтаж натяжного потолка в стандартной комнате занимает около 1–3 часов. Весь процесс проходит без пыли и грязи.`,
    },
  ];
}
