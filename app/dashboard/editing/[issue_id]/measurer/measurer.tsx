"use client";

import { ArticleMeasurements } from "@/app/api/v2/assemble-issue/route";
import { ArticleFrame } from "@/app/components/issue/article/article-frame";
import { IssueFrame } from "@/app/components/issue/issue-frame";
import { ArticleExpanded } from "@/app/utils/data-types";
import { useEffect, useRef, useState } from "react";
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
  setMeasurements: (
    measurements: Map<ArticleExpanded, ArticleMeasurements>,
  ) => void;
}> = ({ articles, setMeasurements }) => {
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);
  const currentArticle = articles[currentArticleIndex];

  const [currentMeasurements, setCurrentMeasurements] = useState(
    new Map<ArticleExpanded, ArticleMeasurements>(),
  );
  const currentArticleRef = useRef<HTMLDivElement>(null);

  // reset if articles updated
  useEffect(() => {
    setCurrentMeasurements(new Map());
  }, [articles, setCurrentMeasurements]);

  useEffect(() => {
    if (!currentArticleRef.current) {
      return;
    }

    const newMeasurement = measureArticle(
      currentArticle.id,
      currentArticleRef.current,
    );

    currentMeasurements.set(currentArticle, newMeasurement);
    setCurrentMeasurements(new Map(currentMeasurements.entries()));
    if (currentArticleIndex + 1 < articles.length) {
      setCurrentArticleIndex(currentArticleIndex + 1);
    } else {
      setMeasurements(currentMeasurements);
    }
  }, [
    articles.length,
    currentArticle,
    currentArticle.id,
    currentArticleIndex,
    currentMeasurements,
    setCurrentMeasurements,
    setMeasurements,
  ]);

  if (!articles.length || !currentArticle) {
    return null;
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
