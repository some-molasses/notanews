import { Article } from "@/app/utils/data-types";
import Link from "next/link";
import "./articles-table.scss";

export const ArticlesTable: React.FC<{ articles: Article[] }> = ({
  articles,
}) => {
  return (
    <div id="articles-table-container">
      <table id="articles-table">
        <thead>
          <tr>
            <th>
              <div className="cell">title</div>
            </th>
            <th>
              <div className="cell">author</div>
            </th>
            <th>
              <div className="cell">issue</div>
            </th>
            <th>
              <div className="cell">state</div>
            </th>
            <th>
              <div className="cell">date</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article: Article) => {
            return (
              <tr key={article.id}>
                <td>
                  <Link
                    href={`/dashboard/article/${article.id}`}
                    className="cell"
                  >
                    {article.title}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/dashboard/article/${article.id}`}
                    className="cell"
                  >
                    {article.pseudonym}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/dashboard/article/${article.id}`}
                    className="cell"
                  >
                    notanews 2025.1
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
                  <Link
                    href={`/dashboard/article/${article.id}`}
                    className="cell"
                  >
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
          })}
        </tbody>
      </table>
    </div>
  );
};
