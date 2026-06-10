import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";
import { getCityPhrase } from "../../content/city-copy";

export function getCalculatorMetadata(ctx: SeoContext) {
  const { city, locale } = ctx;
  const isUk = locale === "uk";
  
  if (city) {
    const cityInCity = getCityPhrase(city.slug, locale);
    return {
      title: buildTitle(
        isUk
          ? `Калькулятор натяжних стель ${cityInCity} — онлайн розрахунок вартості за м²`
          : `Калькулятор натяжных потолков ${cityInCity} — онлайн расчет стоимости за м²`
      ),
      description: buildDescription(
        isUk
          ? `Розрахуйте вартість натяжної стелі ${cityInCity} за допомогою нашого 7-крокового онлайн калькулятора. Отримайте орієнтовний кошторис робіт під ключ.`
          : `Рассчитайте стоимость натяжного потолка ${cityInCity} с помощью нашего 7-шагового онлайн калькулятора. Получите ориентировочную смету работ под ключ.`
      ),
      ogImageSlug: `calculator-${city.slug}`,
    };
  }

  return {
    title: buildTitle(
      isUk
        ? "Калькулятор натяжних стель — онлайн розрахунок вартості за м²"
        : "Калькулятор натяжных потолков — онлайн расчет стоимости за м²"
    ),
    description: buildDescription(
      isUk
        ? "Розрахуйте вартість натяжної стелі за допомогою нашого 7-крокового онлайн калькулятора. Оберіть приміщення, матеріал, профіль та отримайте орієнтовний кошторис під ключ."
        : "Рассчитайте стоимость натяжного потолка с помощью нашего 7-шагового онлайн калькулятора. Выберите помещение, материал, профиль и получите ориентировочную смету под ключ."
    ),
    ogImageSlug: "calculator",
  };
}
