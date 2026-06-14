import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildPath, buildHreflangAlternates } from "@/seo";
import { getCityBySlug, cities } from "@/config/geo-matrix";
import { getServiceBySlug } from "@/config/services.config";
import { resolveRoute } from "@/lib/route-resolver";
import { parsePathname, getActiveCityFromParams, getActiveLocaleFromParams } from "@/lib/route-resolver";

beforeEach(() => {
  const kyiv = getCityBySlug("kyiv");
  if (kyiv) kyiv.active = true;
});

afterEach(() => {
  const kyiv = getCityBySlug("kyiv");
  if (kyiv) kyiv.active = false;
});

describe("SEO Path Builder", () => {
  it("should generate correct paths for default locale (uk) without prefix", () => {
    const path = buildPath("home", "uk");
    expect(path).toBe("/");

    const servicePath = buildPath("matovi-steli", "uk");
    expect(servicePath).toBe("/matovi-steli");

    const cityPath = buildPath("home", "uk", "kyiv");
    expect(cityPath).toBe("/kyiv");

    const cityServicePath = buildPath("matovi-steli", "uk", "kyiv");
    expect(cityServicePath).toBe("/kyiv/matovi-steli");

    const calcPath = buildPath("calculator", "uk");
    expect(calcPath).toBe("/calculator");

    const calcCityPath = buildPath("calculator", "uk", "kyiv");
    expect(calcCityPath).toBe("/kyiv/calculator");
  });

  it("should generate correct paths for russian locale (ru) with prefix", () => {
    const path = buildPath("home", "ru");
    expect(path).toBe("/ru");

    const servicePath = buildPath("matovi-steli", "ru");
    expect(servicePath).toBe("/ru/matovi-steli");

    const cityPath = buildPath("home", "ru", "kyiv");
    expect(cityPath).toBe("/ru/kyiv");

    const cityServicePath = buildPath("matovi-steli", "ru", "kyiv");
    expect(cityServicePath).toBe("/ru/kyiv/matovi-steli");

    const calcPath = buildPath("calculator", "ru");
    expect(calcPath).toBe("/ru/calculator");

    const calcCityPath = buildPath("calculator", "ru", "kyiv");
    expect(calcCityPath).toBe("/ru/kyiv/calculator");
  });

  it("should clean trailing slashes correctly", () => {
    const servicePath = buildPath("matovi-steli", "uk");
    expect(servicePath.endsWith("/")).toBe(false);
  });

  it("should generate correct hreflang alternates", () => {
    const alternates = buildHreflangAlternates("matovi-steli", "kyiv");
    expect(alternates["x-default"]).toBe("https://novastelya.com/kyiv/matovi-steli");
    expect(alternates["uk-UA"]).toBe("https://novastelya.com/kyiv/matovi-steli");
    expect(alternates["ru-UA"]).toBe("https://novastelya.com/ru/kyiv/matovi-steli");
  });
});

describe("Geo Matrix and Configurations", () => {
  it("should resolve cities by slug correctly", () => {
    const kyiv = getCityBySlug("kyiv");
    expect(kyiv).not.toBeNull();
    expect(kyiv?.uk).toBe("Київ");

    const invalid = getCityBySlug("invalid-slug");
    expect(invalid).toBeNull();
  });

  it("should resolve services by slug correctly", () => {
    const matte = getServiceBySlug("matovi-steli");
    expect(matte).not.toBeNull();
    expect(matte?.category).toBe("materials");
  });

  it("should ensure no active city slug is in the reserved routes list", () => {
    const RESERVED = ["prices", "faq", "portfolio", "blog", "contacts", "about", "api", "admin"];
    cities.forEach((city) => {
      expect(RESERVED.includes(city.slug.toLowerCase())).toBe(false);
    });
  });
});

describe("Route Resolver", () => {
  it("should resolve single segment routes", () => {
    const homeUk = resolveRoute("uk");
    expect(homeUk.type).toBe("home");
    expect((homeUk as any).locale).toBe("uk");

    const homeRu = resolveRoute("ru");
    expect(homeRu.type).toBe("home");
    expect((homeRu as any).locale).toBe("ru");

    const kyivHub = resolveRoute("kyiv");
    expect(kyivHub.type).toBe("city-hub");
    expect((kyivHub as any).city.slug).toBe("kyiv");
    expect((kyivHub as any).locale).toBe("uk");

    const serviceUk = resolveRoute("matovi-steli");
    expect(serviceUk.type).toBe("service");
    expect((serviceUk as any).service.slug).toBe("matovi-steli");
    expect((serviceUk as any).locale).toBe("uk");

    const pricesUk = resolveRoute("ciny");
    expect(pricesUk.type).toBe("prices");
    expect((pricesUk as any).city).toBeNull();
    expect((pricesUk as any).locale).toBe("uk");

    const contactsUk = resolveRoute("kontakty");
    expect(contactsUk.type).toBe("contacts");
    expect((contactsUk as any).city).toBeNull();
    expect((contactsUk as any).locale).toBe("uk");

    const calcUk = resolveRoute("calculator");
    expect(calcUk.type).toBe("calculator");
    expect((calcUk as any).city).toBeNull();
    expect((calcUk as any).locale).toBe("uk");
  });

  it("should resolve double segment routes", () => {
    const kyivServiceUk = resolveRoute("kyiv", "matovi-steli");
    expect(kyivServiceUk.type).toBe("city-service");
    expect((kyivServiceUk as any).city.slug).toBe("kyiv");
    expect((kyivServiceUk as any).service.slug).toBe("matovi-steli");
    expect((kyivServiceUk as any).locale).toBe("uk");

    const ruKyivHub = resolveRoute("ru", "kyiv");
    expect(ruKyivHub.type).toBe("city-hub");
    expect((ruKyivHub as any).city.slug).toBe("kyiv");
    expect((ruKyivHub as any).locale).toBe("ru");

    const ruService = resolveRoute("ru", "matovi-steli");
    expect(ruService.type).toBe("service");
    expect((ruService as any).service.slug).toBe("matovi-steli");
    expect((ruService as any).locale).toBe("ru");

    const kyivPricesUk = resolveRoute("kyiv", "ciny");
    expect(kyivPricesUk.type).toBe("prices");
    expect((kyivPricesUk as any).city.slug).toBe("kyiv");
    expect((kyivPricesUk as any).locale).toBe("uk");

    const kyivContactsUk = resolveRoute("kyiv", "kontakty");
    expect(kyivContactsUk.type).toBe("contacts");
    expect((kyivContactsUk as any).city.slug).toBe("kyiv");
    expect((kyivContactsUk as any).locale).toBe("uk");

    const ruContacts = resolveRoute("ru", "kontakty");
    expect(ruContacts.type).toBe("contacts");
    expect((ruContacts as any).city).toBeNull();
    expect((ruContacts as any).locale).toBe("ru");

    const kyivCalcUk = resolveRoute("kyiv", "calculator");
    expect(kyivCalcUk.type).toBe("calculator");
    expect((kyivCalcUk as any).city.slug).toBe("kyiv");
    expect((kyivCalcUk as any).locale).toBe("uk");

    const ruCalc = resolveRoute("ru", "calculator");
    expect(ruCalc.type).toBe("calculator");
    expect((ruCalc as any).city).toBeNull();
    expect((ruCalc as any).locale).toBe("ru");
  });

  it("should resolve triple segment routes", () => {
    const ruKyivService = resolveRoute("ru", "kyiv", "matovi-steli");
    expect(ruKyivService.type).toBe("city-service");
    expect((ruKyivService as any).city.slug).toBe("kyiv");
    expect((ruKyivService as any).service.slug).toBe("matovi-steli");
    expect((ruKyivService as any).locale).toBe("ru");

    const ruKyivPrices = resolveRoute("ru", "kyiv", "ciny");
    expect(ruKyivPrices.type).toBe("prices");
    expect((ruKyivPrices as any).city.slug).toBe("kyiv");
    expect((ruKyivPrices as any).locale).toBe("ru");

    const ruKyivContacts = resolveRoute("ru", "kyiv", "kontakty");
    expect(ruKyivContacts.type).toBe("contacts");
    expect((ruKyivContacts as any).city.slug).toBe("kyiv");
    expect((ruKyivContacts as any).locale).toBe("ru");

    const ruKyivCalc = resolveRoute("ru", "kyiv", "calculator");
    expect(ruKyivCalc.type).toBe("calculator");
    expect((ruKyivCalc as any).city.slug).toBe("kyiv");
    expect((ruKyivCalc as any).locale).toBe("ru");
  });
});

describe("parsePathname", () => {
  it("should parse various path combinations correctly", () => {
    const dniproConfig = getCityBySlug("dnipro");

    // 1. Root
    expect(parsePathname("/")).toEqual({ locale: "uk", city: dniproConfig });
    expect(parsePathname("/ru")).toEqual({ locale: "ru", city: dniproConfig });

    // 2. City Hubs
    const kyivHub = parsePathname("/kyiv");
    expect(kyivHub.locale).toBe("uk");
    expect(kyivHub.city?.slug).toBe("kyiv");

    const ruKyivHub = parsePathname("/ru/kyiv");
    expect(ruKyivHub.locale).toBe("ru");
    expect(ruKyivHub.city?.slug).toBe("kyiv");

    // 3. General Services
    expect(parsePathname("/matovi-steli")).toEqual({ locale: "uk", city: dniproConfig });
    expect(parsePathname("/ru/matovi-steli")).toEqual({ locale: "ru", city: dniproConfig });

    // 4. City Services
    const kyivService = parsePathname("/kyiv/matovi-steli");
    expect(kyivService.locale).toBe("uk");
    expect(kyivService.city?.slug).toBe("kyiv");

    const ruKyivService = parsePathname("/ru/kyiv/matovi-steli");
    expect(ruKyivService.locale).toBe("ru");
    expect(ruKyivService.city?.slug).toBe("kyiv");
  });
});

describe("Metadata Parameter Extractors (Route Shift)", () => {
  it("should correctly resolve city and locale when locale prefix is omitted (params.locale is city slug)", () => {
    const shiftedParams = { locale: "kyiv" };
    expect(getActiveCityFromParams(shiftedParams)?.slug).toBe("kyiv");
    expect(getActiveLocaleFromParams(shiftedParams)).toBe("uk");
  });

  it("should correctly resolve city and locale when locale prefix is present (locale in params.locale, city in params.city)", () => {
    const regularParams = { locale: "ru", city: "kyiv" };
    expect(getActiveCityFromParams(regularParams)?.slug).toBe("kyiv");
    expect(getActiveLocaleFromParams(regularParams)).toBe("ru");
  });

  it("should return dnipro city and default locale when params are empty", () => {
    expect(getActiveCityFromParams({})?.slug).toBe("dnipro");
    expect(getActiveLocaleFromParams({})).toBe("uk");
  });
});
