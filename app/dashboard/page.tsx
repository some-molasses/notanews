import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import "./articles-overview.scss";

interface Article {
  title: string;
  body: string;
  pseudonym: string;
  created_at: string;
}

export default async function Home() {
  const articles = (await fetch(`${process.env.LOCAL_DOMAIN}/api/python`).then(
    (r) => r.json(),
  )) as Article[];

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main className="right-content">
      <h1>Articles</h1>
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
                <tr>
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
