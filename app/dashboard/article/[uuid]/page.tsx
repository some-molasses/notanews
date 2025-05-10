import { Column, Row } from "@/app/components/layout/layout-components";
import { getJWT, redirectIfNotLoggedIn } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import React from "react";
import "./article-editor.scss";
import Tiptap from "@/app/components/tiptap/tiptap";
import { Button } from "@/app/components/button/button.server";
import { UpdateArticleButton } from "./components/update-article-button";

export default async function ArticleEditor({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const supabase = await createClient();
  await redirectIfNotLoggedIn(supabase);

  const jwt = await getJWT(supabase);

  const articles = (await fetch(
    `${process.env.LOCAL_DOMAIN}/api/articles?id=${(await params).uuid}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  ).then((r) => r.json())) as Article[];

  if (articles.length !== 1) {
    throw new Error(`Bad article given?`);
  }

  const article = articles[0];

  return (
    <div id="article-editor">
      <Column className="metadata-inputs">
        <input
          id="title-input"
          placeholder="your title here"
          defaultValue={article.title ?? ""}
        />
        <input
          id="pseudonym-input"
          placeholder="a creative author name"
          defaultValue={article.pseudonym ?? ""}
        />
      </Column>
      <Tiptap defaultContent={article.body} />
      <UpdateArticleButton />
    </div>
  );
}
