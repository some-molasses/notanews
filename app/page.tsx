import "./articles-overview.scss";

interface Article {
  title: string;
  body: string;
  pseudonym: string;
  created_at: string;
}

export default async function Home() {
  console.log(`${process.env.LOCAL_DOMAIN}/api/python`);
  const data = (await fetch(`${process.env.LOCAL_DOMAIN}/api/python`).then(
    (r) => r.json(),
  )) as Article[];

  return (
    <main className="right-content">
      <h1>Articles</h1>
      <div id="articles-table-container">
        <table id="articles-table">
          <tr>
            <th>title</th>
            <th>author</th>
          </tr>
          {data.map((article: Article) => {
            return (
              <tr>
                <td>{article.title}</td>
                <td>{article.pseudonym}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </main>
  );
}
