import { ArticleExpanded } from "./data-types";

export const getArticleById = async (
  id: string,
  jwt: string,
): Promise<ArticleExpanded | null> => {
  if (!id) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_LOCAL_DOMAIN) {
    throw new Error("No local domain set");
  }

  const articles = (await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/articles?id=${id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  ).then((r) => r.json())) as ArticleExpanded[];

  if (articles.length !== 1) {
    return null;
  }

  return articles[0];
};

// @example url "/papers"
export const fetchApi = async <T>(
  url: string,
  jwt: string,
  options: { method: string },
): Promise<T> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/${url}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      method: options.method,
    },
  );

  if (!res.ok) {
    throw new Error(`Request to ${url} failed`);
  }

  return res.json();
};
