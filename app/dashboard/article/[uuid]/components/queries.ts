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

  // then submit
  await fetchApi(`articles/${article.id}/submit`, jwt, {
    method: "PATCH",
  });

  clearDashboardCacheAction();
  onSubmit();
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
