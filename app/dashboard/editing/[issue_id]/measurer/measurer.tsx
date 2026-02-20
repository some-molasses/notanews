"use client";

import { ArticleMeasurements } from "@/app/api/v2/assemble-issue/route";
import { ArticleFrame } from "@/app/components/issue/article/article-frame";
import { IssueFrame } from "@/app/components/issue/issue-frame";
import { ArticleExpanded } from "@/app/utils/data-types";
import { useRef, useState } from "react";
import "./measurer.scss";

const groupContentByColumn = (articleFrame: HTMLDivElement) => {
  return Map.groupBy(
    articleFrame.children,
    (el) => el.getBoundingClientRect().x,
  );
};

const measureArticle = (
  articleId: string,
  articleFrame: HTMLDivElement,
): ArticleMeasurements => {
  const columns = groupContentByColumn(articleFrame);

  return {
    article_id: articleId,
    columns: Array.from(columns.values()).map((column) => ({
      element_count: column.length,
      height: column.reduce(
        (sum, el) => sum + el.getBoundingClientRect().height,
        0,
      ),
    })),
  };
};

export const Measurer: React.FC<{
  articles: ArticleExpanded[];
  setMeasurements: (measurements: Map<ArticleExpanded, number>) => void;
}> = ({ articles, setMeasurements }) => {
  const [currentArticle, setCurrentArticle] = useState<ArticleExpanded>(
    articles[0],
  );
  const currentArticleRef = useRef<HTMLDivElement>(null);

  if (!articles.length || !currentArticle) {
    return null;
  }

  if (currentArticleRef.current) {
    console.log(measureArticle(currentArticle.id, currentArticleRef.current));
  }

  return (
    <div id="article-measurer">
      <IssueFrame>
        <ArticleFrame
          article={currentArticle}
          key={currentArticle?.id}
          bodyRef={currentArticleRef}
        />
      </IssueFrame>
    </div>
  );
};
