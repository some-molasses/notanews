"use server";

import {
  authenticatePage,
  redirectIfNotLoggedIn,
} from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import React from "react";
import "./article-editor.scss";
import { getArticleById } from "@/app/utils/queries";
import { ArticleEditorClient } from "./components/editor";
import { Article } from "@/app/utils/data-types";

export default async function ArticleEditor({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const uuid = (await params).uuid;
  const article: Article | null = await getArticleById(supabase, uuid, jwt);

  if (article === null) {
    return null;
  }

  return <ArticleEditorClient article={article} />;
}
