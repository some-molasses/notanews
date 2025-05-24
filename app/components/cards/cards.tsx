import React from "react";
import { Row } from "../layout/layout-components";
import "./cards.scss";
import Link from "next/link";

export const CardsList: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Row className="cards-list">{children}</Row>;
};

export const Card: React.FC<{ children: React.ReactNode; href?: string }> = ({
  children,
  href,
}) => {
  if (!href) {
    return <div className="card">{children}</div>;
  }

  return (
    <Link href={href} className="card">
      {children}
    </Link>
  );
};
