import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { Row } from "../components/layout/layout-components";
import { CreateArticleButton } from "./components/create-article-button";
import "./articles-overview.scss";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  const articles = (await fetch(`${process.env.LOCAL_DOMAIN}/api/articles`, {
    headers: { Authorization: `Bearer ${jwt}` },
  }).then((r) => r.json())) as Article[];

  return (
    <>
      <Row className="title-row">
        <h1>Articles</h1>
        <Row>
          <CreateArticleButton />
        </Row>
      </Row>
      <div id="articles-table-container">
        <table id="articles-table">
          <thead>
            <tr>
              <th>title</th>
              <th>author</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article: Article) => {
              return (
                <tr key={article.id}>
                  <td>
                    <Link href={`/dashboard/article/${article.id}`}>
                      {article.title}
                    </Link>
                  </td>
                  <td>{article.pseudonym}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
