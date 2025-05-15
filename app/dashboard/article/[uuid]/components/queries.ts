import { getJWT } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/client";
import { clearDashboardCacheAction } from "./actions";
import { Article } from "@/app/utils/data-types";
import { useRouter } from "next/navigation";

export async function updateArticle(article: Article) {
  const supabase = await createClient();

  const jwt = await getJWT(supabase);
  const newState = (await fetch("/api/articles", {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(article),
  }).then((r) => r.json())) as [Article];

  console.log("updated state:", newState);

  clearDashboardCacheAction();
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
