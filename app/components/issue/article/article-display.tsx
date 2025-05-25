import { Article } from "@/app/utils/data-types";
import { Heading1 } from "../../typography/typography";
import "./article-display.scss";

export const ArticleDisplay: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <article className="article article-display">
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
