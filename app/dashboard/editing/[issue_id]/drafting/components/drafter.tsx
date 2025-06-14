"use client";

import { Article } from "@/app/utils/data-types";
import { Measurer } from "./measurer";
import { useState } from "react";
import { MeasuredArticle } from "../layout-compactor";
import { ArticleDisplay } from "@/app/components/issue/article/article-display";
import { IssueDisplay } from "@/app/components/issue/issue-display";

export const Drafter: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [measurements, setMeasurements] = useState<MeasuredArticle[]>([]);

  if (measurements.length === 0) {
    return (
      <Measurer registerMeasurements={setMeasurements} articles={articles} />
    );
  }

  return (
    <IssueDisplay>
      {measurements.map((measurement) => (
        <ArticleDisplay
          article={measurement.article}
          key={measurement.article.id}
        />
      ))}
    </IssueDisplay>
  );
};
