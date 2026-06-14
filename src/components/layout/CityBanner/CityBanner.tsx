import React from "react";
import { headers } from "next/headers";
import { getCityBySlug } from "@/config/geo-matrix";
import { CityBannerClient } from "./CityBannerClient";

type CityBannerProps = {
  locale: "uk" | "ru";
};

export async function CityBanner({ locale }: CityBannerProps) {
  return null;
}
