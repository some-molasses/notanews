"use server";

import { createClient } from "../utils/supabase/server";
import { Row } from "../components/layout/layout-components";
import "./articles-overview.scss";
import { authenticatePage } from "../utils/auth-utils";
import { Article, ArticleExpanded } from "../utils/data-types";
import { ArticlesTable } from "./components/articles-table";
import { PageTitle } from "../components/page-title/page-title";
import { fetchApi } from "../utils/queries";
import { Button } from "../components/button/button.server";
import { CreateArticleAction } from "./components/actions";

export default async function Home() {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const articles: ArticleExpanded[] = (
    (await fetchApi("/articles", jwt, { method: "GET" })) as ArticleExpanded[]
  ).sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1));

  console.log(await fetchApi("/issues/close_overdue", jwt, { method: "POST" }));

  return (
    <div id="articles-overview">
      <PageTitle>my articles</PageTitle>
      <Row id="button-row">
        <form>
          <Button handler={CreateArticleAction}>Create article</Button>
        </form>
      </Row>
      <ArticlesTable articles={articles} />
    </div>
  );
}
