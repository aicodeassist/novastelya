import { getStaticRoutes } from "./routes/static-routes";
import { getServiceRoutes } from "./routes/service-routes";
import { getCityRoutes } from "./routes/city-routes";
import { getCityServiceRoutes } from "./routes/city-service-routes";
import { getBlogRoutes } from "./routes/blog-routes";
import { getPortfolioRoutes } from "./routes/portfolio-routes";

export function generateSitemap() {
  return [
    ...getStaticRoutes(),
    ...getServiceRoutes(),
    ...getCityRoutes(),
    ...getCityServiceRoutes(),
    ...getBlogRoutes(),
    ...getPortfolioRoutes(),
  ];
}
export { generateSitemap as generate };
