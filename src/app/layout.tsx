import "@/styles/variables.css";
import "@/styles/reset.css";
import "@/styles/global.css";
import { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import fs from "fs/promises";
import path from "path";
import { Inter, Syne } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

type Props = {
  children: ReactNode;
};

async function getThemeStyles(): Promise<string> {
  try {
    const settingsPath = path.join(process.cwd(), "src/config/settings.json");
    const fileContent = await fs.readFile(settingsPath, "utf-8");
    const settings = JSON.parse(fileContent);
    const { colors, fonts, radius } = settings.theme;

    return `
      :root {
        --color-gold: ${colors.gold};
        --color-gold-hover: ${colors.goldHover};
        --color-gold-muted: ${colors.goldMuted};
        --color-bg: ${colors.bg};
        --color-bg-secondary: ${colors.bgSecondary};
        --color-surface: ${colors.surface};
        --color-surface-hover: ${colors.surfaceHover};
        --color-border: ${colors.border};
        --color-border-hover: ${colors.borderHover};
        --color-text: ${colors.text};
        --color-text-secondary: ${colors.textSecondary};
        --color-text-muted: ${colors.textMuted};
        --font-family-sans: ${fonts.sans};
        --font-family-serif: ${fonts.serif};
        --radius-xs: ${radius.xs};
        --radius-sm: ${radius.sm};
        --radius-md: ${radius.md};
        --radius-lg: ${radius.lg};
        --radius-xl: ${radius.xl};
      }
    `;
  } catch (error) {
    console.error("Failed to load settings.json for theme overrides:", error);
    return "";
  }
}

export default async function RootLayout({ children }: Props) {
  let locale = "uk";
  try {
    locale = await getLocale();
  } catch (error) {
    // next-intl context not initialized (e.g., on /admin paths)
    locale = "uk";
  }

  const themeCss = await getThemeStyles();

  return (
    <html lang={locale} className={`${inter.variable} ${syne.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

