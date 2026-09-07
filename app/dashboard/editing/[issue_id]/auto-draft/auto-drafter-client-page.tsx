"use client";

import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import {
  Article,
  ArticleData,
  enrichArticles,
  IssueExpanded,
} from "@/app/utils/data-types";
import { useEffect, useState } from "react";
import { Measurer } from "../measurer/measurer";
import { ArticleMeasurements } from "../measurer/measurer";
import { constructLayout, Run } from "../layout-definer/layout-definer";
import {
  PageContents,
  PageFrame,
  PagesFrame,
} from "@/app/components/issue/page/page-frame";
import { IssuePage, layoutToPages } from "../layout-definer/layout-to-pages";

export const AutoDrafterClientPage: React.FC<{
  initialArticles: ArticleData[];
  issue: IssueExpanded;
}> = ({ initialArticles, issue }) => {
  const [articles] = useState<Article[]>(enrichArticles(initialArticles));
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

  useEffect(() => {
    if (!pages) {
      return;
    }

    console.info(measurements, layout, pages);
  }, [measurements, layout, pages]);

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
      {pages ? (
        <PagesFrame>
          {pages.map((page, i) => {
            return (
              <PageFrame key={i}>
                <PageContents page={page} />
              </PageFrame>
            );
          })}
        </PagesFrame>
      ) : null}
    </PageContainer>
  );
};
