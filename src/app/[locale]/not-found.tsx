import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "var(--space-xl)",
      }}
    >
      <h1
        style={{
          fontSize: "5rem",
          color: "var(--color-gold)",
          marginBottom: "var(--space-xs)",
          fontFamily: "var(--font-family-serif)",
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "var(--space-md)" }}>
        {t("notFoundTitle")}
      </h2>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-lg)",
          maxWidth: "450px",
          lineHeight: "var(--line-height-relaxed)",
        }}
      >
        {t("notFoundDesc")}
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          backgroundColor: "var(--color-gold)",
          color: "#0a0b0e",
          padding: "10px 24px",
          borderRadius: "var(--radius-md)",
          fontWeight: "var(--font-weight-semibold)",
          transition: "background-color var(--transition-fast)",
        }}
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
