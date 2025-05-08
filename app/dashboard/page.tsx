import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import "./articles-overview.scss";
import { Row } from "../components/layout/layout";
import { Button } from "../components/button/button";
import { nothing } from "./actions";

interface Article {
  title: string;
  body: string;
  pseudonym: string;
  created_at: string;
  id: string;
}

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  const articles = (await fetch(`${process.env.LOCAL_DOMAIN}/api/python`, {
    headers: { Authorization: `Bearer ${jwt}` },
  }).then((r) => r.json())) as Article[];

  return (
    <main className="right-content">
      <Row className="title-row">
        <h1>Articles</h1>
        <div>
          <Button handler={nothing}>Create article</Button>
        </div>
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
                  <td>{article.title}</td>
                  <td>{article.pseudonym}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
