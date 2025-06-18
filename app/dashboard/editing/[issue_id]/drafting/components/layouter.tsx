// client component, but not a boundary component, so no "use client" directive;

import { IssueDisplay } from "@/app/components/issue/issue-display";
import { MeasuredArticle } from "../layout-compactor";
import { useEffect, useRef, useState } from "react";
import { Article } from "@/app/utils/data-types";
import { ArticleDisplay } from "@/app/components/issue/article/article-display";

function intersect<T>(a: T[], b: T[]): T[] {
  return a.filter((item) => b.includes(item));
}

function unique<T>(a: T[]): T[] {
  return [...new Set(a)];
}

const getMultiColumners = (articles: MeasuredArticle[]) =>
  articles
    .filter((a) => a.nColumns > 1)
    .sort((a, b) => b.nColumns - a.nColumns);

const validateArrays = (
  remaining: MeasuredArticle[],
  current: Article[],
  defined: Article[],
  all: MeasuredArticle[],
): void => {
  const remainingIds = remaining.map((r) => r.article.id);
  const currentIds = current.map((c) => c.id);
  const definedIds = defined.map((d) => d.id);
  const allIds = all.map((a) => a.article.id);

  // all articles exist
  for (const articleId in allIds) {
    if (
      !remainingIds.includes(articleId) &&
      !currentIds.includes(articleId) &&
      !definedIds.includes(articleId)
    ) {
      throw new Error(
        `Article has been dropped by layout process: ${articleId}`,
      );
    }
  }

  // no articles intersect
  const r_c = intersect(remainingIds, currentIds);
  const c_d = intersect(currentIds, definedIds);
  const d_r = intersect(definedIds, remainingIds);

  if (r_c.length > 0) {
    throw new Error(`Intersecting r/c articles ${r_c.join(",")}`);
  }

  if (c_d.length > 0) {
    throw new Error(`Intersecting c/d articles ${c_d.join(",")}`);
  }

  if (d_r.length > 0) {
    throw new Error(`Intersecting d/r articles ${d_r.join(",")}`);
  }
};

const countExistingColumns = (issueDisplay: HTMLDivElement) => {
  const articlesDisplayed = Array.from(
    issueDisplay.querySelectorAll("article"),
  );

  const xPositions = unique(
    articlesDisplayed.map((a) => a.getBoundingClientRect().x),
  );

  return xPositions.length;
};

const getLastArticle = (issueDisplay: HTMLDivElement) => {
  return Array.from(issueDisplay.querySelectorAll("article"))[0];
};

export const Layouter: React.FC<{
  articles: MeasuredArticle[];
  registerLayout: (articles: Article[]) => void;
}> = ({ articles, registerLayout }) => {
  // invariant: remaining + current + defined = all articles, non-intersecting
  const [remaining, setRemaining] = useState<MeasuredArticle[]>(articles);
  const [current, setCurrent] = useState<Article[]>([]);
  const [defined, setDefined] = useState<Article[]>([]);

  const issueDisplay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    validateArrays(remaining, current, defined, articles);

    if (remaining.length === 0 && current.length === 0) {
      registerLayout(defined);
      return;
    }

    // new spread
    if (current.length === 0) {
      const multiCols = getMultiColumners(remaining);
      const selectedArticle =
        multiCols.length > 0 ? multiCols[0].article : remaining[0].article;

      setCurrent([selectedArticle]);
      setRemaining(
        remaining.filter(
          (marticle) => marticle.article.id != selectedArticle.id,
        ),
      );
    }

    // existing spread
    const columnsWithArticles = countExistingColumns(issueDisplay.current!);
    const lastArticle = getLastArticle(issueDisplay.current!);
    const lastBottomMargin: number =
      issueDisplay.current!.getBoundingClientRect().bottom -
      lastArticle.getBoundingClientRect().bottom;

    // base (exit) case
    if (columnsWithArticles % 2 === 0 && lastBottomMargin < 200) {
      setDefined([...defined, ...current]);
      setCurrent([]);

      return;
    }

    // if there's still space, try to fill it with one/two col articles

    // if that succeeds, ?? try again somehow? not sure
    // if that fails, commit to defined array
  }, [remaining, current, defined, articles, registerLayout]);

  return (
    <IssueDisplay forceDimensions ref={issueDisplay}>
      {current.map((article) => (
        <ArticleDisplay article={article} key={article.id} />
      ))}
    </IssueDisplay>
  );
};
