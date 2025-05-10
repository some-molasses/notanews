"use client";

import { getJWT } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/client";
import { Button } from "@/app/components/button/button.client";

export const UpdateArticleButton: React.FC = () => {
  const updateArticle = async () => {
    const supabase = await createClient();

    const jwt = await getJWT(supabase);
    const newState = (await fetch("/api/articles", {
      headers: { Authorization: `Bearer ${jwt}` },
      method: "PATCH",
    }).then((r) => r.json())) as [Article];

    console.log(newState);
  };

  return <Button handler={updateArticle}>Update article</Button>;
};
