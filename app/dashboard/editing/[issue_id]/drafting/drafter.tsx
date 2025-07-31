"use client";

import { ArticleExpanded } from "@/app/utils/data-types";
import { ArticleDisplay } from "@/app/components/issue/article/article-display";
import React, { useState } from "react";

export const Drafter: React.FC<{ articles: ArticleExpanded[] }> = ({
  articles,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  return (
    <div className="articles-viewer">
      <div className="article-stack">
        {articles.map((article, index) => {
          if (index !== currentPage) {
            return null;
          }

          return (
            <div className="drafter-display-page" key={article.id}>
              <div className="drafter-display-page-inner">
                <ArticleDisplay article={article}></ArticleDisplay>
              </div>
            </div>
          );
        })}
      </div>
      <DrafterNavigation
        toPreviousPage={() => setCurrentPage(Math.max(currentPage - 1, 0))}
        toNextPage={() =>
          setCurrentPage(Math.min(currentPage + 1, articles.length - 1))
        }
        currentPage={currentPage + 1}
      />
    </div>
  );
};

const DrafterNavigation: React.FC<{
  toPreviousPage: () => void;
  toNextPage: () => void;
  currentPage: number;
}> = ({ toPreviousPage, toNextPage, currentPage }) => {
  return (
    <div className="drafter-navigation">
      <div className="button arrow left" onClick={() => toPreviousPage()}>
        <span>L</span>
      </div>
      <div className="page-display">Page {currentPage}</div>
      <div className="button arrow right" onClick={() => toNextPage()}>
        <span>R</span>
      </div>
    </div>
  );
};
