import { Row } from "@/app/components/layout/layout-components";
import { getJWT, redirectIfNotLoggedIn } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import React from "react";

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
    <>
      <Row className="title-row">
        <h1>{article.title}</h1>
        <p>{article.body}</p>
      </Row>
    </>
  );
}
