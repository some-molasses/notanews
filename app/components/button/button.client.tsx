"use client";

import Link from "next/link";
import "./button.scss";
import { ButtonProps } from "./button.shared";

export const Button: React.FC<ButtonProps> = ({
  children,
  handler,
  variant,
  href,
}) => {
  if (!href && !handler) {
    throw new Error(`Must have href or handler`);
  }

  if (href && handler) {
    throw new Error(`Cannot have both href or handler`);
  }

  if (href) {
    return (
      <Link className={`main-button variant-${variant}`} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`main-button variant-${variant}`}
      onClick={() => (handler as () => void)()}
    >
      {children}
    </button>
  );
};
