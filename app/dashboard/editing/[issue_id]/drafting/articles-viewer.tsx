"use client";

import { ArticleExpanded } from "@/app/utils/data-types";
import { ArticleDisplay } from "@/app/components/issue/article/article-display";
import { useState } from "react";

export const ArticlesViewer: React.FC<{ articles: ArticleExpanded[] }> = ({
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
      <div className="drafter-navigation">
        <div
          className="arrow left"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
        >
          <span>L</span>
        </div>
        <div
          className="arrow right"
          onClick={() =>
            setCurrentPage(Math.min(currentPage + 1, articles.length - 1))
          }
        >
          <span>R</span>
        </div>
      </div>
    </div>
  );
};
