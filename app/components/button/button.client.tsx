"use client";

import "./button.scss";
import { ButtonProps } from "./button.shared";

export const Button: React.FC<ButtonProps> = ({
  children,
  handler,
  variant,
}) => {
  return (
    <button
      className={`main-button variant-${variant}`}
      onClick={() => handler()}
    >
      {children}
    </button>
  );
};
