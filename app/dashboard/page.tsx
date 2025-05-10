import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { Row } from "../components/layout/layout-components";
import { CreateArticleButton } from "./components/create-article-button";
import "./articles-overview.scss";
import Link from "next/link";
import { Trocchi } from "next/font/google";
import { redirectIfNotLoggedIn } from "../utils/auth-utils";

const titleFont = Trocchi({ subsets: ["latin"], weight: "400" });

export default async function Home() {
  const supabase = await createClient();
  await redirectIfNotLoggedIn(supabase);

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  const articles = (await fetch(`${process.env.LOCAL_DOMAIN}/api/articles`, {
    headers: { Authorization: `Bearer ${jwt}` },
  }).then((r) => r.json())) as Article[];

  return (
    <div id="articles-overview">
      <Row id="title-row">
        <h1 className={titleFont.className}>my articles</h1>
      </Row>
      <Row id="button-row">
        <CreateArticleButton />
      </Row>
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
                      className="cell"
                    >
                      draft
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
    </div>
  );
}
