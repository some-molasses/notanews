import { getJWT } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/client";
import { clearDashboardCacheAction } from "./actions";

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
