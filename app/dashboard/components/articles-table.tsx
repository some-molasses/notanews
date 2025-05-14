import { Article, ArticleExpanded } from "@/app/utils/data-types";
import Link from "next/link";
import "./articles-table.scss";
import { Table } from "@/app/components/table/table";

export const ArticlesTable: React.FC<{ articles: ArticleExpanded[] }> = ({
  articles,
}) => {
  return (
    <div id="articles-table-container">
      <Table
        id="articles-table"
        headers={["title", "author", "issue", "state", "date"]}
        data={articles}
        rowGenerator={makeArticleRow}
      ></Table>
    </div>
  );
};

const makeArticleRow = (article: ArticleExpanded) => {
  return (
    <tr key={article.id}>
      <td>
        <Link href={`/dashboard/article/${article.id}`} className="cell">
          {article.title}
        </Link>
      </td>
      <td>
        <Link href={`/dashboard/article/${article.id}`} className="cell">
          {article.pseudonym}
        </Link>
      </td>
      <td>
        <Link href={`/dashboard/article/${article.id}`} className="cell">
          {article.issues?.papers
            ? `${article.issues.papers.name} ${article.issues.volume_number}.${article.issues.issue_number}`
            : "-"}
        </Link>
      </td>
      <td>
        <Link
          href={`/dashboard/article/${article.id}`}
          className={`cell state-${article.state.toLowerCase()}`}
        >
          {article.state}
        </Link>
      </td>
      <td>
        <Link href={`/dashboard/article/${article.id}`} className="cell">
          {new Date(article.created_at)
            .toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toLowerCase()}
        </Link>
      </td>
    </tr>
  );
};
