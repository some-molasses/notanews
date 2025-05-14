import { createClient } from "../utils/supabase/server";
import { Row } from "../components/layout/layout-components";
import { CreateArticleButton } from "./components/create-article-button";
import "./articles-overview.scss";
import { authenticatePage } from "../utils/auth-utils";
import { Article } from "../utils/data-types";
import { ArticlesTable } from "./components/articles-table";
import { PageTitle } from "../components/page-title/page-title";

export default async function Home() {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const articles = (
    (await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/articles`, {
      headers: { Authorization: `Bearer ${jwt}` },
    }).then((r) => r.json())) as Article[]
  ).sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1));

  return (
    <div id="articles-overview">
      <PageTitle>my articles</PageTitle>
      <Row id="button-row">
        <CreateArticleButton />
      </Row>
      <ArticlesTable articles={articles} />
    </div>
  );
}
