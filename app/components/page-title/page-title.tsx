import React from "react";
import { Row } from "../layout/layout-components";
import { TITLE_FONT } from "@/app/layout";

export const PageTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Row id="title-row">
      <h1 className={TITLE_FONT.className}>{children}</h1>
    </Row>
  );
};
