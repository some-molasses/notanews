"use client";

import {
  ARTICLE_INNER_MAX_HEIGHT_PX,
  getArticleFrameMeasurableContents,
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
import { preformatArticle } from "../article-preformatter";

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

type PositionedElement = {
  el: Element;
  rect: DOMRect;
};

const sortColumn = (column: PositionedElement[]): PositionedElement[] => {
  return column.sort((a, b) => a.rect.y - b.rect.y);
};

const X_MERGEABILITY_RANGE = 30;
const mergeColumns = (
  columns: Map<number, PositionedElement[]>,
): Map<number, PositionedElement[]> => {
  const entries = Array.from(columns.entries());
  for (let i = 1; i < entries.length; i++) {
    // x value is at 0
    if (Math.abs(entries[i][0] - entries[i - 1][0]) > X_MERGEABILITY_RANGE) {
      continue;
    }

    // move group i to group i - 1, delete group i
    entries[i - 1][1].push(...entries[i][1]);
    entries[i - 1][1] = sortColumn(entries[i - 1][1]);

    entries.splice(i, 1);
  }

  return new Map(entries);
};

const groupContentByColumn = (
  articleFrame: HTMLDivElement,
): Map<number, Element[]> => {
  const positionedChildren = getArticleFrameMeasurableContents(
    articleFrame,
  ).map((c) => ({
    el: c,
    rect: c.getBoundingClientRect(),
  }));

  const initialGroups = Map.groupBy(positionedChildren, (el) => el.rect.x);

  // lists & blockquotes are left-offset, and thereby have a
  // slightly different x coordinate than the rest of their group
  const merged = mergeColumns(initialGroups);

  // remove bounding client rect storage
  const resultMap = new Map<number, Element[]>();
  for (const entry of merged.entries()) {
    resultMap.set(
      entry[0],
      entry[1].map(({ el }) => el),
    );
  }

  return resultMap;
};

function getColumnHeight(column: Element[]) {
  const top = column.reduce(
    (prevMin, e) => Math.min(e.getBoundingClientRect().top, prevMin),
    Number.MAX_SAFE_INTEGER,
  );

  const bottom = column.reduce(
    (prevMax, e) => Math.max(e.getBoundingClientRect().bottom, prevMax),
    0,
  );

  return bottom - top;
}

const measureArticle = (
  article: Article,
  articleFrame: HTMLDivElement,
): ArticleMeasurements => {
  const columns = groupContentByColumn(articleFrame);

  const columnMeasurements: Column[] = Array.from(columns.values()).map(
    (column) => ({
      element_count: column.length,
      height: getColumnHeight(column),
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

    preformatArticle(currentArticleRef.current);
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
