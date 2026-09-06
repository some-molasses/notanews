import { Article } from "@/app/utils/data-types";
import { Heading1 } from "../../typography/typography";
import "./article-frame.scss";
import { ArticleMeasurements } from "@/app/dashboard/editing/[issue_id]/measurer/measurer";
import React from "react";

export const ARTICLE_INNER_MAX_HEIGHT_PX = 856;

export const MeasurerArticleFrame: React.FC<{
  article: Article;
  fullHeight?: boolean;
  bodyRef?: React.Ref<HTMLDivElement>;
}> = ({ article, fullHeight, bodyRef }) => {
  return (
    <article
      className={`article article-frame simple-frame ${fullHeight ? "full-height" : ""}`}
      id={`article-${article.id}`}
    >
      <div
        className="article-body article-contents"
        ref={bodyRef} // ref must be on innermost div,
        // as column-location calculations track this element's children
        dangerouslySetInnerHTML={{
          __html: `${getHeaderString(article)} ${article._body}`,
        }}
      />
    </article>
  );
};

export const MeasuredArticleFrame: React.FC<{
  article: Article;
  measurements: ArticleMeasurements;
}> = ({ article, measurements }) => {
  return (
    <article
      className={`article article-frame measured-frame`}
      id={`article-${article.id}`}
    >
      <ArticleHeader article={article} />
      <div className="article-body columns">
        {measurements.columns.map((column, i) => (
          <div
            dangerouslySetInnerHTML={{ __html: column.contents ?? "" }}
            key={i}
            className="article-column article-contents"
          ></div>
        ))}
      </div>
    </article>
  );
};

export const getHeaderString = (article: Article): string => {
  return `<div className="article-header">
        <h1 className="article-title">${article.title}</h1>
        <div className="metadata-row">
          <span className="author">${article.pseudonym}</span>
        </div>
      </div>`;
};

export const ArticleHeader: React.FC<{ article: Article }> = ({ article }) => (
  <div className="article-header">
    <Heading1 className="article-title">{article.title}</Heading1>
    <div className="metadata-row">
      <span className="author">{article.pseudonym}</span>
    </div>
  </div>
);
