import { describe, it, expect } from "vitest";
import citiesJson from "@/config/cities.json";
import servicesJson from "@/config/services.json";
import { cities, activeCities } from "@/config/geo-matrix";
import { services, getServiceBySlug } from "@/config/services.config";

describe("CMS Structure Configuration", () => {
  it("should contain all regions in cities.json and match geo-matrix", () => {
    expect(citiesJson.length).toBeGreaterThanOrEqual(6);
    expect(cities.length).toEqual(citiesJson.length);
    expect(activeCities.length).toBeGreaterThan(0);
    
    const kyiv = cities.find(c => c.slug === "kyiv");
    expect(kyiv).toBeDefined();
    expect(kyiv?.uk).toBe("Київ");
  });

  it("should contain all services including the new rooms in services.json", () => {
    expect(servicesJson.length).toBeGreaterThanOrEqual(15);
    expect(services.length).toEqual(servicesJson.length);

    const childrens = getServiceBySlug("childrens-room-ceilings");
    expect(childrens).not.toBeNull();
    expect(childrens?.category).toBe("rooms");
    expect(childrens?.uk.title).toContain("дитячу");

    const office = getServiceBySlug("office-ceilings");
    expect(office).not.toBeNull();
    expect(office?.category).toBe("rooms");
    expect(office?.uk.title).toContain("офіс");
  });
});
