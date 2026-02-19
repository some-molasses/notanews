import { Button } from "@/app/components/button/button.server";
import { RowReverse } from "@/app/components/layout/layout-components";
import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import {
  getIssueById,
  getSubmittedArticlesForIssue,
} from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";
import { ArticlesTable } from "../../components/articles-table";
import "./editing-issue.scss";

export default async function EditingIssuePage({
  params,
}: {
  params: Promise<{ issue_id: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue = await getIssueById(jwt, (await params).issue_id);
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
        <RowReverse className="draft-buttons">
          <Button href={`/dashboard/editing/${issue.id}/drafting`}>
            Begin drafting
          </Button>
          <Button href={`/dashboard/editing/${issue.id}/auto-draft`}>
            Auto-draft
          </Button>
        </RowReverse>
      ) : null}
    </PageContainer>
  );
}
