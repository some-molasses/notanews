import { ArticleMeasurements } from "@/app/api/v2/assemble-issue/route";
import { ARTICLE_INNER_MAX_HEIGHT_PX } from "@/app/components/issue/article/article-frame";

// todo: optimization: turn this into a class that can only possibly store one multi-col article
// also let it have an id
export type Run = {
  articles: ArticleMeasurements[];
};

// a run can only have one multi-col article, which, if exists, is at its beginning
function validateRun(run: Run) {
  for (let i = 1; i < run.articles.length; i++) {
    if (run.articles[i].columns.length > 1) {
      throw new Error(
        `Too many columns in article ${run.articles[i].article_id}`,
      );
    }
  }
}

function sortArticlesByLength(
  a: ArticleMeasurements,
  b: ArticleMeasurements,
): number {
  if (a.columns < b.columns) {
    return 1;
  }

  if (b.columns > a.columns) {
    return -1;
  }

  return (
    b.columns[b.columns.length - 1].height -
    a.columns[a.columns.length - 1].height
  );
}

function filterSingleColumn(
  articles: ArticleMeasurements[],
  maxHeight: number,
): ArticleMeasurements[] {
  return articles
    .filter((a) => a.columns.length === 1 && a.columns[0].height <= maxHeight)
    .sort(sortArticlesByLength);
}

function filterMultiColumn(
  articles: ArticleMeasurements[],
  maxColumns?: number,
): ArticleMeasurements[] {
  // if maxColumns = 1, this intentionally returns []
  return articles
    .filter((a) => a.columns.length > 1)
    .filter((a) => (maxColumns ? a.columns.length <= maxColumns : true))
    .sort(sortArticlesByLength);
}

function getRemainingLastColumnHeight(run: Run): number {
  validateRun(run);

  return run.articles.reduce(
    (acc, article) => acc - article.columns[article.columns.length - 1].height,
    ARTICLE_INNER_MAX_HEIGHT_PX,
  );
}

function commitRun(pendingRun: Run, remainingArticles: ArticleMeasurements[]) {
  const nextRunSingleCol =
    pendingRun.articles.length > 0 &&
    pendingRun.articles[0].columns.length % 2 === 1;

  return [
    pendingRun, // commit run
    ...constructLayoutRecurse(
      { articles: [] },
      remainingArticles,
      nextRunSingleCol ? 1 : undefined,
    ),
  ];
}

function constructLayoutRecurse(
  pendingRun: Run,
  remainingArticles: ArticleMeasurements[],
  maxColumns?: 1, // could later be generalized
): Run[] {
  if (remainingArticles.length === 0) {
    if (pendingRun.articles.length > 0) {
      return [pendingRun];
    }

    return [];
  }

  const multiColArticles = filterMultiColumn(remainingArticles, maxColumns);
  // if blank spread, start with a multi-col (if exists)
  if (pendingRun.articles.length === 0 && multiColArticles.length > 0) {
    // todo: optimization: only filter this once
    const selected = multiColArticles[0];
    const newRun: Run = {
      articles: [selected],
    };

    return constructLayoutRecurse(
      newRun,
      remainingArticles.filter((a) => a.article_id !== selected.article_id),
      maxColumns,
    );
  }

  // if cannot currently add a multi-col article
  const maxHeight = getRemainingLastColumnHeight(pendingRun);
  const eligibleArticles = filterSingleColumn(remainingArticles, maxHeight);

  // if all remaining single-col articles too big, or none remain at all
  if (eligibleArticles.length === 0) {
    commitRun(pendingRun, remainingArticles);
  }

  const selected = eligibleArticles[0];
  return constructLayoutRecurse(
    { articles: [...pendingRun.articles, selected] },
    remainingArticles.filter((a) => a.article_id !== selected.article_id),
    maxColumns,
  );
}

export function constructLayout(articles: ArticleMeasurements[]): Run[] {
  return constructLayoutRecurse({ articles: [] }, articles);
}
