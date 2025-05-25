import { Article } from "@/app/utils/data-types";

export type MeasuredArticle = {
  article: Article;
  nColumns: number;
  lastColumnHeight: number;
};

export type ArticleForLayout = MeasuredArticle & {
  isPlaced: boolean;
  index: number;
};

export const PAGE_HEIGHT_PX = 1056;

const sortArticlesBySizeDesc = (a: ArticleForLayout, b: ArticleForLayout) => {
  // sort descending by size
  if (a.nColumns !== b.nColumns) {
    return b.nColumns - a.nColumns;
  } else {
    return b.lastColumnHeight - a.lastColumnHeight;
  }
};

const getArticlesForLayout = (
  articles: MeasuredArticle[],
): ArticleForLayout[] =>
  articles
    .map((a, idx) => ({
      ...a,
      isPlaced: false,
      index: idx,
    }))
    .sort(sortArticlesBySizeDesc);

type LayoutOption = {
  articlesUsed: ArticleForLayout[];
  remainingHeight: number;
};

// NOTE: only currently handles filling in space with single-column articles
const generateSpreadForRec = (
  columns: number,
  remainingHeight: number,
  articles: ArticleForLayout[],
): LayoutOption => {
  const eligibleArticles = articles.filter(
    (a) => a.nColumns === 1 && a.lastColumnHeight <= remainingHeight,
  );

  if (eligibleArticles.length === 0) {
    return { remainingHeight, articlesUsed: [] };
  }

  const options: LayoutOption[] = [];
  for (const article of eligibleArticles) {
    const result = generateSpreadForRec(
      columns,
      remainingHeight - article.lastColumnHeight,
      eligibleArticles.filter((a) => a.index > article.index),
    );

    options.push({
      remainingHeight: result.remainingHeight,
      articlesUsed: result.articlesUsed.concat(article),
    });
  }

  const bestOption = options.reduce((a, b) =>
    a.remainingHeight < b.remainingHeight ? a : b,
  );

  return bestOption;
};

const generateSpreadFor = (
  initialArticle: ArticleForLayout,
  articles: ArticleForLayout[],
): LayoutOption => {
  // if nColumns == 3, there are two columns to fill: the remainder of the third and the entire fourth.
  //  this extends to higher numbers
  const columnsToFill = initialArticle.nColumns % 2 === 1 ? 2 : 1;
  const heightToFill = PAGE_HEIGHT_PX - initialArticle.lastColumnHeight;
  const smallerArticles = articles.slice(initialArticle.index);

  if (articles.length === 0) {
    throw new Error(`No articles`);
  }

  const layout = generateSpreadForRec(
    columnsToFill,
    heightToFill,
    smallerArticles,
  );

  return {
    articlesUsed: layout.articlesUsed
      .concat(initialArticle)
      .sort(sortArticlesBySizeDesc),
    remainingHeight: layout.remainingHeight,
  };
};

// can pre-generate table of best compacting options:
//  no need to pre-generate; no article will ever be top-of-column twice

// result table: |articles.len (init. heights)| * 2^|articles?|

export const autogenerateIssueLayout = (props: {
  articles: MeasuredArticle[];
}) => {
  // sorted by length, DESC
  const articles: ArticleForLayout[] = getArticlesForLayout(props.articles);

  let remainingArticles = articles;

  // while articles remain
  const layouts: LayoutOption[] = [];
  while (remainingArticles.length > 0) {
    const multicolArticles = remainingArticles.filter(
      (a) => !a.isPlaced && a.nColumns > 1,
    );

    // @todo do something with the results
    let initialArticle: ArticleForLayout;
    if (multicolArticles.length === 0) {
      initialArticle = articles[0];
    } else {
      initialArticle = multicolArticles[0];
    }

    const layout = generateSpreadFor(initialArticle, remainingArticles);
    if (layout.articlesUsed.length === 0) {
      throw new Error(`No articles used in layout`);
    }

    for (const article of layout.articlesUsed) {
      articles[article.index].isPlaced = true;
    }

    layouts.push(layout);
    remainingArticles = remainingArticles.filter((a) => !a.isPlaced);
  }

  return layouts;
};
