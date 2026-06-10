"use client";

import React, { useState } from "react";
import styles from "./login.module.css";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Невірний пароль");
      }
    } catch (err) {
      setError("Помилка з'єднання з сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>🔐</span>
          </div>
          <h2 className={styles.title}>Вхід в Адмінпанель</h2>
          <p className={styles.subtitle}>Введіть пароль адміністратора</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
            />
            {error && <div className={styles.error}>{error}</div>}
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <div className={styles.footer}>NOVA STELYA CMS Platform Layer v4.0</div>
      </div>
    </div>
  );
}
