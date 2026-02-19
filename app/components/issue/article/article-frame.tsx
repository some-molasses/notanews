import { Article } from "@/app/utils/data-types";
import { Heading1 } from "../../typography/typography";
import "./article-frame.scss";

export const ArticleFrame: React.FC<{
  article: Article;
  fullHeight?: boolean;
  bodyRef?: React.Ref<HTMLDivElement>;
}> = ({ article, fullHeight, bodyRef }) => {
  return (
    <article
      className={`article article-frame ${fullHeight ? "full-height" : ""}`}
      id={`article-${article.id}`}
    >
      <Heading1 className="article-title">{article.title}</Heading1>
      <div className="metadata-row">
        <span className="author">{article.pseudonym}</span>
      </div>
      <div
        className="article-body"
        ref={bodyRef}
        dangerouslySetInnerHTML={{ __html: article.body ?? "" }}
      ></div>
    </article>
  );
};
