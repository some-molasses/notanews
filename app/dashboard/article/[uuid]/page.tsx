"use server";

import {
  authenticatePage,
  redirectIfNotLoggedIn,
} from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import React from "react";
import "./article-editor.scss";
import { fetchApi, getArticleById } from "@/app/utils/queries";
import { ArticleEditorClient } from "./components/editor";
import { ArticleExpanded, IssueExpanded } from "@/app/utils/data-types";

export default async function ArticleEditor({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const uuid = (await params).uuid;
  const article: ArticleExpanded | null = await getArticleById(uuid, jwt);

  const eligibleIssues: IssueExpanded[] = await fetchApi(
    `/issues?state=open`,
    jwt,
    {
      method: "GET",
    },
  );

  if (article === null) {
    return null;
  }

  return (
    <ArticleEditorClient article={article} eligibleIssues={eligibleIssues} />
  );
}
