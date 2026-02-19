"use client";

import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { ArticleExpanded, IssueExpanded } from "@/app/utils/data-types";
import { useState } from "react";
import { Measurer } from "../measurer/measurer";

export const AutoDrafterClientPage: React.FC<{
  initialArticles: ArticleExpanded[];
  issue: IssueExpanded;
}> = ({ initialArticles, issue }) => {
  const [articles, setArticles] = useState<ArticleExpanded[]>(initialArticles);

  return (
    <PageContainer id="auto-drafter-page">
      {articles.length === 0 ? (
        <PageTitle>
          no articles in {issue.papers.name} {issue.name}
        </PageTitle>
      ) : null}
      <Measurer articles={articles} setMeasurements={() => {}} />
    </PageContainer>
  );
};
