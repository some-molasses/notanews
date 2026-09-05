import { Article } from "@/app/utils/data-types";
import { Heading1 } from "../../typography/typography";
import "./article-frame.scss";
import { ArticleMeasurements } from "@/app/api/v2/assemble-issue/route";
import React from "react";

export const ARTICLE_INNER_MAX_HEIGHT_PX = 856;

export const SimpleArticleFrame: React.FC<{
  article: Article;
  fullHeight?: boolean;
  bodyRef?: React.Ref<HTMLDivElement>;
}> = ({ article, fullHeight, bodyRef }) => {
  return (
    <article
      className={`article article-frame ${fullHeight ? "full-height" : ""}`}
      id={`article-${article.id}`}
    >
      <ArticleHeader article={article} />
      <div
        className="article-body"
        ref={bodyRef}
        dangerouslySetInnerHTML={{ __html: article.body ?? "" }}
      />
    </article>
  );
};

export const MeasuredArticleFrame: React.FC<{
  article: Article;
  measurements: ArticleMeasurements;
}> = ({ article, measurements }) => {
  return (
    <article className={`article article-frame`} id={`article-${article.id}`}>
      <ArticleHeader article={article} />
      <div className="article-body">
        {measurements.columns.map((column, i) => (
          <div
            dangerouslySetInnerHTML={{ __html: column.contents ?? "" }}
            key={i}
            className="article-column"
          />
        ))}
      </div>
    </article>
  );
};

const ArticleHeader: React.FC<{ article: Article }> = ({ article }) => (
  <div className="article-header">
    <Heading1 className="article-title">{article.title}</Heading1>
    <div className="metadata-row">
      <span className="author">{article.pseudonym}</span>
    </div>
  </div>
);
