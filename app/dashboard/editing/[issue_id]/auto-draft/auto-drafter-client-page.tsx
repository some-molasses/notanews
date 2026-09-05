"use client";

import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { ArticleExpanded, IssueExpanded } from "@/app/utils/data-types";
import { useEffect, useState } from "react";
import { Measurer } from "../measurer/measurer";
import { ArticleMeasurements } from "@/app/api/v2/assemble-issue/route";
import { constructLayout, Run } from "../layout-definer/layout-definer";

export const AutoDrafterClientPage: React.FC<{
  initialArticles: ArticleExpanded[];
  issue: IssueExpanded;
}> = ({ initialArticles, issue }) => {
  const [articles, setArticles] = useState<ArticleExpanded[]>(initialArticles);
  const [measurements, setMeasurements] =
    useState<Map<string, ArticleMeasurements>>();
  const [layout, setLayout] = useState<Run[]>();

  console.log(measurements);
  console.log(layout);

  useEffect(() => {
    if (!measurements) {
      return;
    }

    setLayout(constructLayout(Array.from(measurements.values())));
  }, [measurements, setLayout]);

  return (
    <PageContainer id="auto-drafter-page">
      {articles.length === 0 ? (
        <PageTitle>
          no articles in {issue.papers.name} {issue.name}
        </PageTitle>
      ) : null}
      <Measurer articles={articles} setMeasurements={setMeasurements} />
    </PageContainer>
  );
};
