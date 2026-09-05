"use client";

import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { ArticleExpanded, IssueExpanded } from "@/app/utils/data-types";
import { useEffect, useState } from "react";
import { Measurer } from "../measurer/measurer";
import { ArticleMeasurements } from "@/app/api/v2/assemble-issue/route";
import { constructLayout, Run } from "../layout-definer/layout-definer";
import { IssueFrame } from "@/app/components/issue/issue-frame";
import {
  MeasuredArticleFrame,
  MeasurerArticleFrame,
} from "@/app/components/issue/article/article-frame";
import {
  PageContents,
  PageFrame,
} from "@/app/components/issue/page/page-frame";
import { IssuePage, layoutToPages } from "../layout-definer/layout-to-pages";

export const AutoDrafterClientPage: React.FC<{
  initialArticles: ArticleExpanded[];
  issue: IssueExpanded;
}> = ({ initialArticles, issue }) => {
  const [articles, setArticles] = useState<ArticleExpanded[]>(initialArticles);
  const [measurements, setMeasurements] =
    useState<Map<string, ArticleMeasurements>>();
  const [layout, setLayout] = useState<Run[]>();
  const [pages, setPages] = useState<IssuePage[]>();

  useEffect(() => {
    if (!measurements || layout) {
      return;
    }

    setLayout(constructLayout(Array.from(measurements.values())));
  }, [measurements, layout, setLayout]);

  useEffect(() => {
    if (!layout || pages) {
      return;
    }

    setPages(layoutToPages(layout));
  }, [layout, pages, setPages]);

  return (
    <PageContainer id="auto-drafter-page">
      {articles.length === 0 ? (
        <PageTitle>
          no articles in {issue.papers.name} {issue.name}
        </PageTitle>
      ) : null}
      {!measurements ? (
        <Measurer articles={articles} setMeasurements={setMeasurements} />
      ) : null}
      {pages
        ? pages.map((page, i) => {
            return (
              <PageFrame key={i}>
                <PageContents page={page} />
              </PageFrame>
            );
          })
        : null}
    </PageContainer>
  );
};
