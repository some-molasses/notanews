import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { Heading2 } from "@/app/components/typography/typography";
import { authenticatePage } from "@/app/utils/auth-utils";
import {
  getIssueById,
  getSubmittedArticlesForIssue,
} from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";
import { ArticlesTable } from "../../components/articles-table";
import "./issue.scss";

export default async function IssueView({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue_id = (await params).uuid;

  // @todo replace this with a joined query
  const issue = await getIssueById(jwt, issue_id);

  const articles = await getSubmittedArticlesForIssue(jwt, issue.id);

  return (
    <PageContainer id="issue-page">
      <PageTitle>{issue.name}</PageTitle>
      <section>
        <Heading2>articles</Heading2>
        <ArticlesTable articles={articles} />
      </section>
    </PageContainer>
  );
}
