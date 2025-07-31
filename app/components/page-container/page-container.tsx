import React from "react";
import "./page-container.scss";

export const PageContainer: React.FC<{
  id: string;
  children: React.ReactNode;
  leftContent?: React.ReactNode;
}> = ({ children, id, leftContent }) => {
  return (
    <div className="page" id={id}>
      <main className="right-content">{children}</main>
      <div className="left-content">{leftContent}</div>
    </div>
  );
};
