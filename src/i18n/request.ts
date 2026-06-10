import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "../../i18n.config";
import ukMessages from "../messages/uk.json";
import ruMessages from "../messages/ru.json";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  const messages = locale === "ru" ? ruMessages : ukMessages;

  return {
    locale,
    messages,
  };
});
