"use server";

import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import React from "react";
import "./article-editor.scss";
import { fetchApi, getArticleById } from "@/app/utils/queries";
import { ArticleEditorClient } from "./components/editor";
import {
  ArticleExpanded,
  IssueExpanded,
  MembershipTypes as MembershipType,
} from "@/app/utils/data-types";
import { redirect } from "next/navigation";
import { isUserAnEditor } from "@/app/utils/data-util.shared";

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

  const isEditor = await isUserAnEditor(article?.issues?.papers.id, jwt);

  if (article === null) {
    return null;
  }

  const isUserOriginalAuthor =
    (await supabase.auth.getUser()).data?.user?.id === article.user_id;
  if (!isEditor && !isUserOriginalAuthor) {
    redirect("/dashboard");
  }

  return (
    <ArticleEditorClient
      article={article}
      eligibleIssues={eligibleIssues}
      isUserAnEditor={isEditor}
    />
  );
}
