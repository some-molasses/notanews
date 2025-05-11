import { SupabaseClient } from "@supabase/supabase-js";
import { getJWT } from "./auth-utils";
import { Article } from "./data-types";

export const getArticleById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<Article | null> => {
  if (!id) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_LOCAL_DOMAIN) {
    throw new Error("No local domain set");
  }

  const jwt = await getJWT(supabase);
  const articles = (await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/articles?id=${id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  ).then((r) => r.json())) as Article[];

  if (articles.length !== 1) {
    return null;
  }

  return articles[0];
};
