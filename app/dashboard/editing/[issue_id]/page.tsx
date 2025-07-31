import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./editing-issue.scss";
import {
  getSubmittedArticlesForIssue,
  getIssueById,
} from "@/app/utils/queries";
import { ArticlesTable } from "../../components/articles-table";
import { Button } from "@/app/components/button/button.server";
import { RowReverse } from "@/app/components/layout/layout-components";
import { PageContainer } from "@/app/components/page-container/page-container";

export default async function EditingIssuePage({
  params,
}: {
  params: { issue_id: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue = await getIssueById(jwt, params.issue_id);
  const articles = await getSubmittedArticlesForIssue(jwt, issue.id);

  const pendingArticles = articles.filter(
    (article) => article.state == "pending",
  );

  return (
    <PageContainer id="editing-issue-page">
      <PageTitle>
        editing {issue.papers.name} {issue.name}
      </PageTitle>
      {pendingArticles.length > 0 ? (
        <section>
          <h2>pending articles</h2>
          <ArticlesTable articles={pendingArticles} />
        </section>
      ) : null}
      <section>
        <h2>all articles</h2>
        <ArticlesTable articles={articles} />
      </section>

      {pendingArticles.length === 0 ? (
        <RowReverse>
          <Button href={`/dashboard/editing/${issue.id}/drafting`}>
            Begin drafting
          </Button>
        </RowReverse>
      ) : null}
    </PageContainer>
  );
}
