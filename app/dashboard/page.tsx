import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { Row } from "../components/layout/layout-components";
import { CreateArticleButton } from "./components/create-article-button";
import "./articles-overview.scss";
import Link from "next/link";
import { Trocchi } from "next/font/google";
import { redirectIfNotLoggedIn } from "../utils/auth-utils";
import { Article } from "../utils/data-types";
import { ArticlesTable } from "./components/articles-table";

const titleFont = Trocchi({ subsets: ["latin"], weight: "400" });

export default async function Home() {
  const supabase = await createClient();
  await redirectIfNotLoggedIn(supabase);

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  const articles = (
    (await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/articles`, {
      headers: { Authorization: `Bearer ${jwt}` },
    }).then((r) => r.json())) as Article[]
  ).sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1));

  return (
    <div id="articles-overview">
      <Row id="title-row">
        <h1 className={titleFont.className}>my articles</h1>
      </Row>
      <Row id="button-row">
        <CreateArticleButton />
      </Row>
      <ArticlesTable articles={articles} />
    </div>
  );
}
