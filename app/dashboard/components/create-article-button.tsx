"use client";

import { getJWT } from "@/app/utils/auth-utils";
import { Button } from "../../components/button/button";
import { redirect, useRouter } from "next/navigation";

export const CreateArticleButton: React.FC = () => {
  const router = useRouter();

  const createArticle = async () => {
    const jwt = await getJWT();
    const newArticles = (await fetch("/api/articles", {
      headers: { Authorization: `Bearer ${jwt}` },
      method: "POST",
    }).then((r) => r.json())) as [Article];

    console.log(newArticles[0]);
    router.push(`/dashboard/article/${newArticles[0].id}`);
  };

  return <Button handler={createArticle}>Create article</Button>;
};
