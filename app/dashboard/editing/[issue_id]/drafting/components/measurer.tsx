"use client";

import { ArticleDisplay } from "@/app/components/issue/article/article-display";
import { IssueDisplay } from "@/app/components/issue/issue-display";
import { Article } from "@/app/utils/data-types";
import React, { useEffect, useRef, useState } from "react";
import { MeasuredArticle, autogenerateIssueLayout } from "../layout-compactor";

const getColumnTopElements = (
  body: Element[],
  titleElement: Element,
): Element[] => {
  return body
    .map((element, index) => {
      // first top element is the title
      if (index === 0) {
        return titleElement;
      }

      const thisY = element.getBoundingClientRect().y;
      const prevY = body[index - 1].getBoundingClientRect().y;

      // if this element is further up than its predecessor, we're on the next column
      if (thisY < prevY) {
        return element;
      }

      return null;
    })
    .filter((e) => e !== null) as Element[];
};

export const Measurer: React.FC<{
  articles: Article[];
  registerMeasurements: (measurements: MeasuredArticle[]) => void;
}> = ({ articles, registerMeasurements }) => {
  const [articleIndex, setArticleIndex] = useState(0);

  const articleMeasurements: MeasuredArticle[] = useRef([]).current;

  useEffect(() => {
    if (articleIndex >= articles.length) {
      console.log(autogenerateIssueLayout({ articles: articleMeasurements }));
      registerMeasurements(articleMeasurements);
      return;
    }

    const activeArticle = document.getElementsByClassName(
      "article",
    )[0] as HTMLElement;

    // get elements
    const title = activeArticle.querySelector(".article-title")!;
    const body = activeArticle.querySelector(".article-body")!;

    const bodyElements = Array.from(body.children);
    const topElements = getColumnTopElements(bodyElements, title);

    const nColumns: number = topElements.length;

    // measure last column
    const lastColumnTop: number =
      topElements[nColumns - 1]!.getBoundingClientRect().y;
    const lastColumnBottom: number =
      bodyElements[bodyElements.length - 1].getBoundingClientRect().bottom;
    const lastColumnHeight = lastColumnBottom - lastColumnTop;

    // record and move on
    articleMeasurements[articleIndex] = {
      article: articles[articleIndex],
      nColumns: nColumns,
      lastColumnHeight,
    };

    setArticleIndex(articleIndex + 1);
  }, [articleIndex, articleMeasurements, articles, registerMeasurements]);

  return (
    <IssueDisplay forceDimensions>
      {articleIndex < articles.length ? (
        <ArticleDisplay article={articles[articleIndex]} fullHeight />
      ) : null}
    </IssueDisplay>
  );
};
