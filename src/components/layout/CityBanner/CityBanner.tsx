import React from "react";
import { headers } from "next/headers";
import { getCityBySlug } from "@/config/geo-matrix";
import { CityBannerClient } from "./CityBannerClient";

type CityBannerProps = {
  locale: "uk" | "ru";
};

export async function CityBanner({ locale }: CityBannerProps) {
  const headersList = await headers();
  const detectedCity = headersList.get("x-detected-city") || "";
  const preferredCity = headersList.get("x-preferred-city") || "";

  // Do not show the banner if user has already set a preferred city cookie
  if (preferredCity || !detectedCity) return null;

  const cityConfig = getCityBySlug(detectedCity);
  if (!cityConfig) return null;

  return <CityBannerClient city={cityConfig} locale={locale} />;
}
