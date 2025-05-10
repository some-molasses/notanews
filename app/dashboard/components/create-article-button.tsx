"use client";

import { getJWT } from "@/app/utils/auth-utils";
import { Button } from "../../components/button/button.client";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export const CreateArticleButton: React.FC = () => {
  const router = useRouter();

  const createArticle = async () => {
    const supabase = await createClient();

    const jwt = await getJWT(supabase);
    const newArticles = (await fetch("/api/articles", {
      headers: { Authorization: `Bearer ${jwt}` },
      method: "POST",
    }).then((r) => r.json())) as [Article];

    console.log(newArticles[0]);
    router.push(`/dashboard/article/${newArticles[0].id}`);
  };

  return <Button handler={createArticle}>Create article</Button>;
};
