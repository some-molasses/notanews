"use client";

import { ArticleFrame } from "@/app/components/issue/article/article-frame";
import { IssueFrame } from "@/app/components/issue/issue-frame";
import { ArticleExpanded } from "@/app/utils/data-types";
import { useRef, useState } from "react";
import "./measurer.scss";

export type ArticleMeasurements = {
  columnCount: number;
  lastColumnHeight: number;
  // can be used to split by column later
  columnElementCounts: number[]; // number of elements in column
};

const groupContentByColumn = (articleFrame: HTMLDivElement) => {
  return Map.groupBy(
    articleFrame.children,
    (el) => el.getBoundingClientRect().x,
  );
};

const countArticleColumns = (articleFrame: HTMLDivElement): number => {
  // # of columns = # of unique left boundaries
  return Array.from(groupContentByColumn(articleFrame).keys()).length;
};

const getLastColumnContents = (articleFrame: HTMLDivElement): Element[] => {
  const columns = groupContentByColumn(articleFrame);
  const lastColumnX = Math.max(...columns.keys());
  const lastColumn = columns.get(lastColumnX);

  if (!lastColumn) {
    throw new Error(`No last column despite key ${lastColumnX} existing?`);
  }

  return lastColumn;
};

const getLastColumnHeight = (articleFrame: HTMLDivElement): number => {
  const lastColumn = getLastColumnContents(articleFrame);
  return lastColumn.reduce(
    (sum, el) => sum + el.getBoundingClientRect().height,
    0,
  );
};

const getColumnElementCounts = (articleFrame: HTMLDivElement): number[] => {
  // # of columns = # of unique left boundaries
  const columns = groupContentByColumn(articleFrame);
  const elementsPerColumn = Array.from(columns).map(([left, group]) => [
    left,
    group.length,
  ]);

  // sort columns left-to-right
  const sortedKeyedCounts = elementsPerColumn.sort((a, b) =>
    a[0] < b[0] ? -1 : 1,
  );

  return sortedKeyedCounts.map((_left, count) => count);
};

const measureArticle = (articleFrame: HTMLDivElement): ArticleMeasurements => {
  return {
    lastColumnHeight: getLastColumnHeight(articleFrame),
    columnCount: countArticleColumns(articleFrame),
    columnElementCounts: getColumnElementCounts(articleFrame),
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
