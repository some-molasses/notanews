import { clearDashboardCacheAction } from "./actions";
import { Article } from "@/app/utils/data-types";
import { fetchApi } from "@/app/utils/queries";

export async function updateArticle(article: Article, jwt: string) {
  const newState: [Article] = await fetchApi("articles", jwt, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(article),
  });

  console.log("updated state:", newState);

  clearDashboardCacheAction();
}

export async function submitArticle(
  article: Article,
  jwt: string,
  onSubmit: () => void,
) {
  // first save the existing state
  updateArticle(article, jwt);

  // @todo add this check to the backend
  if (article.issue_id === null) {
    throw new Error(`Cannot submit an article without selecting an issue`);
  }

  // then submit
  await fetchApi(`articles/${article.id}/submit`, jwt, {
    method: "PATCH",
  });

  clearDashboardCacheAction();
  onSubmit();
}

export async function revertArticleToDraft(
  article: Article,
  jwt: string,
  onSuccess: () => void,
) {
  await fetchApi(`articles/${article.id}/revert_to_draft`, jwt, {
    method: "PATCH",
  });

  clearDashboardCacheAction();
  onSuccess();
}

export async function approveArticle(article: Article, jwt: string) {
  await fetchApi(`articles/${article.id}/approve`, jwt, {
    method: "PATCH",
  });

  clearDashboardCacheAction();
}

export async function deleteArticle(
  article: Article,
  jwt: string,
  onDelete: () => void,
) {
  await fetch(`/api/articles/${article.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  }).then((r) => r.json());

  clearDashboardCacheAction();
  onDelete();
}
