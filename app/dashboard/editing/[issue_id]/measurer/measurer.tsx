"use client";

import {
  ARTICLE_INNER_MAX_HEIGHT_PX,
  MeasurerArticleFrame,
} from "@/app/components/issue/article/article-frame";
import { IssueFrame } from "@/app/components/issue/issue-frame";
import {
  Article,
  ArticleDataExpanded,
  ArticleExpanded,
} from "@/app/utils/data-types";
import { useEffect, useRef, useState } from "react";
import "./measurer.scss";
import { AssertionError } from "assert";
import { PageFrame } from "@/app/components/issue/page/page-frame";

type Column = {
  height: number;
  element_count: number;
  contents: string;
};

export class ArticleMeasurements {
  article: Article;
  columns: Column[];

  constructor(article: Article, columns: Column[]) {
    this.article = article;
    this.columns = columns;
  }

  get article_id(): string {
    return this.article.id;
  }

  get title(): string | null {
    return this.article.title;
  }
}

const groupContentByColumn = (articleFrame: HTMLDivElement) => {
  return Map.groupBy(
    articleFrame.children,
    (el) => el.getBoundingClientRect().x,
  );
};

const measureArticle = (
  article: Article,
  articleFrame: HTMLDivElement,
): ArticleMeasurements => {
  const columns = groupContentByColumn(articleFrame);

  const columnMeasurements: Column[] = Array.from(columns.values()).map(
    (column) => ({
      element_count: column.length,
      height: column.reduce(
        (sum, el) => sum + el.getBoundingClientRect().height,
        0,
      ),
      contents: column.reduce(
        (acc: string, el: Element) => acc + el.outerHTML,
        "",
      ),
    }),
  );

  return new ArticleMeasurements(article, columnMeasurements);
};

const validateMeasurements = (
  measurements: Map<string, ArticleMeasurements>,
) => {
  for (const article of measurements.values()) {
    for (let i = 0; i < article.columns.length; i++) {
      const column = article.columns[i];
      if (column.height > ARTICLE_INNER_MAX_HEIGHT_PX) {
        throw new AssertionError({
          message: `Article ${article.title} column ${i} has exceeded max height (${column.height} > ${ARTICLE_INNER_MAX_HEIGHT_PX})`,
        });
      }
    }
  }
};

export const Measurer: React.FC<{
  articles: Article[];
  setMeasurements: (measurements: Map<string, ArticleMeasurements>) => void;
}> = ({ articles, setMeasurements }) => {
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);
  const currentArticle = articles[currentArticleIndex];

  const [currentMeasurements, setCurrentMeasurements] = useState(
    new Map<string, ArticleMeasurements>(),
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

    if (!currentArticle) {
      return;
    }

    if (currentArticleIndex == articles.length) {
      return;
    }

    const newMeasurement = measureArticle(
      currentArticle,
      currentArticleRef.current,
    );

    currentMeasurements.set(currentArticle.id, newMeasurement);
    setCurrentMeasurements(new Map(currentMeasurements.entries()));
    setCurrentArticleIndex(currentArticleIndex + 1);

    if (currentArticleIndex + 1 == articles.length) {
      validateMeasurements(currentMeasurements);
      setMeasurements(currentMeasurements);
    }
  }, [
    articles.length,
    currentArticle,
    currentArticle?.id,
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
      <PageFrame>
        <MeasurerArticleFrame
          article={currentArticle}
          key={currentArticle?.id}
          bodyRef={currentArticleRef}
        />
      </PageFrame>
    </div>
  );
};
