"use client";

import React, { useState, useEffect, useRef, TouchEvent, MouseEvent } from "react";
import { CityConfig } from "@/config/geo-matrix";
import styles from "./BottomSheet.module.css";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: "uk" | "ru";
  currentCity: CityConfig | null;
};

export function BottomSheet({ isOpen, onClose, locale, currentCity }: BottomSheetProps) {
  const isUk = locale === "uk";
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Touch and drag swipe state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset state when sheet opens/closes
  useEffect(() => {
    if (isOpen) {
      setDragY(0);
      setIsDragging(false);
      setIsSuccess(false);
      setIsFormExpanded(false);
      setName("");
      setPhone("");
      setSubmitError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Swipe/Drag gestures
  const handleStart = (clientY: number) => {
    // Only drag down if content is scrolled to top
    if (contentRef.current && contentRef.current.scrollTop > 5) return;
    
    startYRef.current = clientY;
    setIsDragging(true);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    const diff = clientY - startYRef.current;
    // Only allow downward drag
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = window.innerHeight * 0.22; // 22% swipe threshold to close
    if (dragY > threshold) {
      onClose();
    } else {
      // snap back
      setDragY(0);
    }
  };

  // Touch event handlers
  const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientY);
  const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
  const onTouchEnd = () => handleEnd();

  // Mouse event handlers (for desktop testing)
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientY);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientY);
    }
  };
  const onMouseUp = () => handleEnd();

  // Submit Callback Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setSubmitError(isUk ? "Введіть номер телефону" : "Введите номер телефона");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: `Замовлення зворотного дзвінка з мобільного меню. Місто: ${
            currentCity ? currentCity[locale] : "Вся Україна"
          }`,
        }),
      });

      if (!response.ok) throw new Error("API error");

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      setSubmitError(
        isUk
          ? "Помилка відправки. Спробуйте пізніше."
          : "Ошибка отправки. Попробуйте позже."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Backdrop opacity fades out proportionally to downward drag
  const maxDrag = window.innerHeight * 0.8;
  const backdropOpacity = Math.max(0, 1 - dragY / maxDrag);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        style={{
          opacity: backdropOpacity,
          transition: isDragging ? "none" : "opacity 0.4s",
        }}
        onClick={onClose}
      />

      {/* Bottom Sheet Drawer */}
      <div
        ref={sheetRef}
        className={`${styles.sheet} ${isOpen ? styles.sheetOpen : ""}`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Handle Bar Area for swiping */}
        <div
          className={styles.handleArea}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div className={styles.handle} />
        </div>

        {/* Content Container */}
        {/* Content Container */}
        <div ref={contentRef} className={styles.content}>
          <h4 className={styles.title}>
            {isUk ? "Зв'язатися з нами" : "Связаться с нами"}
          </h4>

          {/* Messengers Grid */}
          <div className={styles.contactGrid}>
            <a
              href="https://t.me/novastelya"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <div className={styles.contactIcon} style={{ color: "#229ED9" }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </div>
              <span>Telegram</span>
            </a>

            <a
              href="viber://chat?number=%2B380000000000"
              className={styles.contactItem}
            >
              <div className={styles.contactIcon} style={{ color: "#7360F2" }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.398.002C5.253.002.199 4.953.199 11.047c0 2.588.912 5.023 2.453 6.963L1.5 23.998l6.15-1.08c1.86.99 3.98 1.55 6.23 1.55 6.14 0 11.19-4.95 11.19-11.04S17.54.002 11.398.002zm0 20.39c-2.03 0-3.93-.56-5.56-1.53l-.4-.24-3.65.64.64-3.53-.26-.42c-1.35-1.7-2.15-3.83-2.15-6.12 0-5.14 4.23-9.32 9.43-9.32 5.2 0 9.43 4.18 9.43 9.32s-4.23 9.2-9.48 9.2zm5.17-7.05c-.28-.14-1.65-.81-1.9-.9-.25-.1-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.35-.02-.49-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.14.18 1.91 2.92 4.63 4.09.65.28 1.15.45 1.55.57.65.21 1.25.18 1.72.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z" />
                </svg>
              </div>
              <span>Viber</span>
            </a>

            <a
              href="https://wa.me/380000000000"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <div className={styles.contactIcon} style={{ color: "#25D366" }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <span>WhatsApp</span>
            </a>

            <a
              href="https://instagram.com/novastelya"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <div className={styles.contactIcon} style={{ color: "#E4405F" }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <span>Instagram</span>
            </a>
          </div>

          {/* Phone Numbers List */}
          <div className={styles.phoneList}>
            {currentCity && (
              <a href={`tel:${currentCity.phone.replace(/\s+/g, "")}`} className={styles.phoneRow}>
                <div>
                  <div className={styles.phoneNumber}>{currentCity.phone}</div>
                  <div className={styles.phoneLabel}>
                    {currentCity[locale]} (Офіс)
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            )}

            <a href="tel:+380670000000" className={styles.phoneRow}>
              <div>
                <div className={styles.phoneNumber}>+38 (067) 000-00-00</div>
                <div className={styles.phoneLabel}>Kyivstar</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>

            <a href="tel:+380990000000" className={styles.phoneRow}>
              <div>
                <div className={styles.phoneNumber}>+38 (099) 000-00-00</div>
                <div className={styles.phoneLabel}>Vodafone</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>

          {/* Interactive Callback Form Area */}
          <div className={styles.interactiveArea}>
            {!isFormExpanded && !isSuccess && (
              <button
                type="button"
                className={styles.sheetCta}
                onClick={() => setIsFormExpanded(true)}
              >
                {isUk ? "Замовити зворотний дзвінок" : "Заказать обратный звонок"}
              </button>
            )}

            <div className={`${styles.formExpandContainer} ${isFormExpanded ? styles.expanded : ""}`}>
              {isSuccess ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <p>
                    {isUk
                      ? "Дякуємо! Наш менеджер передзвонить вам найближчим часом."
                      : "Спасибо! Наш менеджер перезвонит вам в ближайшее время."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  {submitError && <div className={styles.error}>{submitError}</div>}

                  <div className={styles.inputGroup}>
                    <label htmlFor="sheet-name">{isUk ? "Ваше ім'я" : "Ваше имя"}</label>
                    <input
                      type="text"
                      id="sheet-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isUk ? "Олександр" : "Александр"}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="sheet-phone">
                      {isUk ? "Номер телефону *" : "Номер телефона *"}
                    </label>
                    <input
                      type="tel"
                      id="sheet-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+380"
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={styles.submitBtn}
                    >
                      {isSubmitting
                        ? isUk
                          ? "Надсилаємо..."
                          : "Отправляем..."
                        : isUk
                        ? "Передзвоніть мені"
                        : "Перезвоните мне"}
                    </button>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => setIsFormExpanded(false)}
                    >
                      {isUk ? "Назад до контактів" : "Назад к контактам"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
