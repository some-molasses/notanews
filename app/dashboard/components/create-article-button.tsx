"use client";

import { getJWT } from "@/app/utils/auth-utils";
import { Button } from "../../components/button/button.client";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { Article } from "@/app/utils/data-types";
import { fetchApi } from "@/app/utils/queries";

export const CreateArticleButton: React.FC = () => {
  const router = useRouter();

  const createArticle = async () => {
    const supabase = await createClient();

    const jwt = await getJWT(supabase);
    const newArticle: Article = await fetchApi("/articles", jwt, {
      method: "POST",
    });

    console.log(`New article created: ${newArticle.id}`);
    router.push(`/dashboard/article/${newArticle.id}`);
  };

  return <Button handler={createArticle}>Create article</Button>;
};
