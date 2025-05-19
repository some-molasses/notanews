"use server";

import Link from "next/link";
import "./button.scss";
import { ButtonProps } from "./button.shared";

export async function Button({
  children,
  handler,
  variant,
  href,
}: ButtonProps) {
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
    <button className={`main-button variant-${variant}`} formAction={handler}>
      {children}
    </button>
  );
}
