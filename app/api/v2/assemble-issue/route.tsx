export type ArticleMeasurements = {
  article_id: string;
  columns: {
    height: number;
    element_count: number;
  }[];
};

export type AssembleIssueRequestBody = {
  articles: ArticleMeasurements[];
};

export type AssembleIssueResponseBody = {
  pages: ArticleMeasurements[];
};

export async function POST() {
  return Response.json({});
}
