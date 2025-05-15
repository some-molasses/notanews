import { getJWT } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/client";
import { clearDashboardCacheAction } from "./actions";
import { Article } from "@/app/utils/data-types";
import { fetchApi } from "@/app/utils/queries";

export async function updateArticle(article: Article) {
  const supabase = await createClient();

  const jwt = await getJWT(supabase);
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

export async function submitArticle(article: Article, onSubmit: () => void) {
  // first save the existing state
  updateArticle(article);

  // then submit
  const supabase = await createClient();
  const jwt = await getJWT(supabase);

  await fetchApi(`articles/${article.id}/submit`, jwt, {
    method: "PATCH",
  });

  clearDashboardCacheAction();
  onSubmit();
}

export async function deleteArticle(article: Article, onDelete: () => void) {
  const supabase = await createClient();

  const jwt = await getJWT(supabase);
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
