"use client";

import { getJWT } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/client";
import { Button } from "@/app/components/button/button.client";
import { revalidatePath } from "next/cache";

export const UpdateArticleButton: React.FC = () => {
  const updateArticle = async () => {
    const supabase = await createClient();

    const jwt = await getJWT(supabase);
    const newState = (await fetch("/api/articles", {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        title: "new title",
        body: "new body",
        pseudonym: "new pseudonym",
        id: "72bd96fa-cf8a-4a92-b32d-f72ef623dab3",
      }),
    }).then((r) => r.json())) as [Article];

    console.log(newState);

    // @ts-expect-error layout unexpected
    revalidatePath("/dashboard", "layout");
  };

  return <Button handler={updateArticle}>Update article</Button>;
};
