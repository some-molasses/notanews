import { IssuePage } from "@/app/dashboard/editing/[issue_id]/layout-definer/layout-to-pages";
import "./page-frame.scss";
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

export const PageContents: React.FC<{ page: IssuePage }> = ({ page }) => {
  return (
    <div className="article-columns">
      <div
        className="article-column article-contents"
        dangerouslySetInnerHTML={{ __html: page.columns.left }}
      />
      <div
        className="article-column article-contents"
        dangerouslySetInnerHTML={{ __html: page.columns.right }}
      />
    </div>
  );
};

export const PagesFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="pages-frame">{children}</div>;
