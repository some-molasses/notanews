import React from "react";
import "./page-container.scss";

export const PageContainer: React.FC<{
  id: string;
  children: React.ReactNode;
  rightNav?: React.ReactNode;
}> = ({ children, id, rightNav }) => {
  return (
    <div className="page" id={id}>
      <main className="right-content">{children}</main>
      <div className="right-nav">{rightNav}</div>
    </div>
  );
};
