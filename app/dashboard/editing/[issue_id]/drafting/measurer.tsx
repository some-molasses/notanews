"use client";

import { ArticleDisplay } from "@/app/components/issue/article/article-display";
import { IssueDisplay } from "@/app/components/issue/issue-display";
import { Article } from "@/app/utils/data-types";
import React, { useEffect, useRef, useState } from "react";

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

export const Measurer: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [articleIndex, setArticleIndex] = useState(0);

  const articleMeasurements: Record<
    number,
    { columnCount: number; lastColumnHeight: number }
  > = useRef({}).current;

  useEffect(() => {
    if (articleIndex >= articles.length) {
      console.log(articleMeasurements);
      return;
    }

    const activeArticle = document.getElementsByClassName(
      "article",
    )[0] as HTMLElement;

    const title = activeArticle.querySelector(".article-title")!;
    const body = activeArticle.querySelector(".article-body")!;

    const bodyElements = Array.from(body.children);
    const topElements = getColumnTopElements(bodyElements, title);

    const columnCount: number = topElements.length;

    const lastColumnTop: number =
      topElements[columnCount - 1]!.getBoundingClientRect().y;

    const lastColumnBottom: number =
      bodyElements[bodyElements.length - 1].getBoundingClientRect().bottom;

    const lastColumnHeight = lastColumnBottom - lastColumnTop;

    articleMeasurements[articleIndex] = { columnCount, lastColumnHeight };

    setArticleIndex(articleIndex + 1);
  }, [articleIndex, articleMeasurements, articles.length]);

  return (
    <IssueDisplay forceDimensions>
      {articleIndex < articles.length ? (
        <ArticleDisplay article={articles[articleIndex]} />
      ) : null}
    </IssueDisplay>
  );
};
