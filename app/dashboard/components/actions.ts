"use server";

import { getJWT } from "@/app/utils/auth-utils";
import { Article } from "@/app/utils/data-types";
import { fetchApi } from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export const CreateArticleAction = async () => {
  const supabase = await createClient();
  const jwt = await getJWT(supabase);

  const article: Article = await fetchApi("/articles", jwt, {
    method: "POST",
  });

  redirect(`/dashboard/article/${article.id}`);
};
