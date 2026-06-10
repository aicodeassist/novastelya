import React from "react";
import styles from "./Card.module.css";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
  variant?: "default" | "glow" | "premium";
};

export const Card = ({
  className = "",
  hoverable = true,
  variant = "default",
  children,
  ...props
}: CardProps) => {
  const cardClass = [
    styles.card,
    hoverable ? styles["card--hoverable"] : "",
    styles[`card--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};
