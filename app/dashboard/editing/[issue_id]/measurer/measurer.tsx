"use client";

import { ArticleFrame } from "@/app/components/issue/article/article-frame";
import { IssueFrame } from "@/app/components/issue/issue-frame";
import { ArticleExpanded } from "@/app/utils/data-types";
import { useRef, useState } from "react";
import "./measurer.scss";

export type ArticleMeasurements = {
  columnCount: number;
  lastColumnHeight: number;
};

// count how many unique x positions exist among the contents of the article
const getUniqueArticleLeftBoundaries = (
  articleFrame: HTMLDivElement,
): number[] => {
  const paragraphLefts = Array.from(articleFrame.children).map(
    (el) => el.getBoundingClientRect().x,
  );

  return Array.from(new Set(paragraphLefts));
};

const countArticleColumns = (articleFrame: HTMLDivElement): number => {
  // # of columns = # of unique left boundaries
  return getUniqueArticleLeftBoundaries(articleFrame).length;
};

const getLastColumnContents = (articleFrame: HTMLDivElement): Element[] => {
  const lefts = getUniqueArticleLeftBoundaries(articleFrame);
  const rightmostLeft = Math.max(...lefts);

  const lastColumnContents = Array.from(articleFrame.children).filter(
    (el) => el.getBoundingClientRect().x === rightmostLeft,
  );

  return lastColumnContents;
};

const getLastColumnHeight = (articleFrame: HTMLDivElement): number => {
  const lastColumn = getLastColumnContents(articleFrame);

  return lastColumn.reduce(
    (sum, el) => sum + el.getBoundingClientRect().height,
    0,
  );
};

const measureArticle = (articleFrame: HTMLDivElement): ArticleMeasurements => {
  return {
    lastColumnHeight: getLastColumnHeight(articleFrame),
    columnCount: countArticleColumns(articleFrame),
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
    console.log(measureArticle(currentArticleRef.current));
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
