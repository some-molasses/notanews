import { Article } from "@/app/utils/data-types";
import { Heading1 } from "../../typography/typography";
import "./article-display.scss";

export const ArticleDisplay: React.FC<{
  article: Article;
  fullHeight?: boolean;
}> = ({ article, fullHeight }) => {
  return (
    <article
      className={`article article-display ${fullHeight ? "full-height" : ""}`}
      id={`article-${article.id}`}
    >
      <Heading1 className="article-title">{article.title}</Heading1>
      <div className="metadata-row">
        <span className="author">{article.pseudonym}</span>
      </div>
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: article.body ?? "" }}
      ></div>
    </article>
  );
};
