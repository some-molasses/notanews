import { ArticleExpanded, Issue, IssueExpanded, Paper } from "./data-types";

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

  const articles: ArticleExpanded[] = await fetchApi(`articles?id=${id}`, jwt);
  if (articles.length !== 1) {
    return null;
  }

  return articles[0];
};

export const getIssues = async (jwt: string, states?: string[]) => {
  const issues = (await fetchApi(
    `issues?${states ? `state=${states.join(",")}` : ""}`,
    jwt,
  )) as IssueExpanded[];

  return issues;
};

export const getIssueById = async (jwt: string, id: string) => {
  const issues = (await fetchApi(`issues/${id}`, jwt)) as IssueExpanded;

  return issues;
};

export const getPaperById = async (paper_id: string, jwt: string) => {
  const paper = (await fetchApi(`papers/${paper_id}`, jwt, {
    method: "GET",
  })) as Paper;

  return paper;
};

export const isEditor = async (jwt: string) => {
  return ((await fetchApi("/members/is_editor", jwt)) as { is_editor: boolean })
    .is_editor;
};

// @example url "/papers"
export const fetchApi = async <T>(
  url: string,
  jwt: string,
  options?: { method?: string; headers?: any; body?: any },
): Promise<T> => {
  if (options?.body && typeof options.body === "object") {
    throw new Error(`Body cannot be an object; JSON.stringify it first`);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/${url}`,
    {
      headers: { ...options?.headers, Authorization: `Bearer ${jwt}` },
      method: options?.method ?? "GET",
      body: options?.body,
    },
  );

  if (!res.ok) {
    throw new Error(`Request to ${url} failed`);
  }

  return res.json();
};
