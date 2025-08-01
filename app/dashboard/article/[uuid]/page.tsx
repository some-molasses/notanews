"use server";

import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import React from "react";
import "./article-editor.scss";
import { fetchApi, getArticleById } from "@/app/utils/queries";
import { ArticleEditorClient } from "./components/editor";
import { ArticleExpanded, IssueExpanded } from "@/app/utils/data-types";
import { redirect } from "next/navigation";
import { isUserAnEditor } from "@/app/utils/data-util.shared";
import { PageContainer } from "@/app/components/page-container/page-container";

export default async function ArticleEditor({
  params,
}: {
  params: { uuid: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const uuid = params.uuid;
  const article: ArticleExpanded | null = await getArticleById(uuid, jwt);

  const eligibleIssues: IssueExpanded[] = await fetchApi(
    `/issues?state=writing`,
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
    <PageContainer id="article-editor-page">
      <ArticleEditorClient
        article={article}
        eligibleIssues={eligibleIssues}
        isUserAnEditor={isEditor}
      />
    </PageContainer>
  );
}
