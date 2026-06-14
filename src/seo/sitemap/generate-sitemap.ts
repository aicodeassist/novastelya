import { getStaticRoutes } from "./routes/static-routes";
import { getServiceRoutes } from "./routes/service-routes";
import { getCityRoutes } from "./routes/city-routes";
import { getCityServiceRoutes } from "./routes/city-service-routes";
import { getPortfolioRoutes } from "./routes/portfolio-routes";

export function generateSitemap() {
  return [
    ...getStaticRoutes(),
    ...getServiceRoutes(),
    ...getCityRoutes(),
    ...getCityServiceRoutes(),
    ...getPortfolioRoutes(),
  ];
}
export { generateSitemap as generate };
