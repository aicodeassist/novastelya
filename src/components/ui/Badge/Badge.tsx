import React from "react";
import styles from "./Badge.module.css";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "gold" | "outline" | "success";
};

export const Badge = ({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) => {
  const badgeClass = [
    styles.badge,
    styles[`badge--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};
