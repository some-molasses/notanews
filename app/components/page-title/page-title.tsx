import React from "react";
import { Row } from "../layout/layout-components";
import { TITLE_FONT } from "@/app/styles";
import "./page-title.scss";

export const PageTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Row id="title-row">
      <h1 className={`${TITLE_FONT.className} page-title`}>{children}</h1>
    </Row>
  );
};

export const PageSubtitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Row id="title-row">
      <span className={`${TITLE_FONT.className} page-subtitle`}>
        {children}
      </span>
    </Row>
  );
};
