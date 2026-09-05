import { Article } from "@/app/utils/data-types";
import { Heading1 } from "../../typography/typography";
import "./page-frame.scss";
import { ArticleMeasurements } from "@/app/api/v2/assemble-issue/route";
import React from "react";

export const PAGE_MAX_HEIGHT_PX = 954;

export const PageFrame: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div style={{ maxHeight: PAGE_MAX_HEIGHT_PX }} className={`page-frame`}>
      {children}
    </div>
  );
};
