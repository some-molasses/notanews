import { ArticleMeasurements } from "./route";

export type ArticleColumn = {
  article_id: string;
  column_index: number;
  height: number | "full";
};

export type IssuePage = {
  left_column_contents: ArticleColumn[];
  right_column_contents: ArticleColumn[];
};

export type ArticleRun = IssuePage[];

export const assembleIssue = (articles: ArticleMeasurements[]): IssuePage[] => {
  const runs = generateInitialRuns(articles);

  // todo: optimize to compress issue

  return runs.flat();
};

function generateInitialRuns(articles: ArticleMeasurements[]): ArticleRun[] {
  return articles.map((article) => {
    const run: ArticleRun = [];

    for (let i = 0; i < article.columns.length; i += 2) {
      run.push({
        left_column_contents: [
          {
            article_id: article.article_id,
            column_index: i,
            height: article.columns[i].height,
          },
        ],
        right_column_contents:
          i + 1 < article.columns.length
            ? [
                {
                  article_id: article.article_id,
                  column_index: i + 1,
                  height: article.columns[i + 1].height,
                },
              ]
            : [],
      });
    }

    return run;
  });
}
