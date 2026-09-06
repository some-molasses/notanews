"use client";

import { PageTitle } from "@/app/components/page-title/page-title";
import { Drafter } from "./drafter";
import { DrafterSidebar } from "./drafter-sidebar";
import { PageContainer } from "@/app/components/page-container/page-container";
import { ArticleDataExpanded, IssueExpanded } from "@/app/utils/data-types";
import { useState } from "react";

export const DrafterClientPage: React.FC<{
  initialArticles: ArticleDataExpanded[];
  issue: IssueExpanded;
}> = ({ initialArticles, issue }) => {
  const [articles, setArticles] =
    useState<ArticleDataExpanded[]>(initialArticles);

  return (
    <PageContainer
      id="drafting-issue-page"
      rightNav={
        <DrafterSidebar articles={articles} setArticles={setArticles} />
      }
    >
      {articles.length === 0 ? (
        <PageTitle>
          no articles in {issue.papers.name} {issue.name}
        </PageTitle>
      ) : null}
      <Drafter articles={articles} />
    </PageContainer>
  );
};
