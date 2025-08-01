import { PageTitle } from "@/app/components/page-title/page-title";
import { Heading2 } from "@/app/components/typography/typography";
import { authenticatePage } from "@/app/utils/auth-utils";
import { Article, ArticleExpanded, Issue, Paper } from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";
import "./issue.scss";
import { fetchApi, getSubmittedArticlesForIssue } from "@/app/utils/queries";
import { ArticlesTable } from "../../components/articles-table";
import { PageContainer } from "@/app/components/page-container/page-container";

export default async function IssueView({
  params,
}: {
  params: { uuid: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue_id = params.uuid;

  // @todo replace this with a joined query
  const issue = (await fetchApi(`issues/${issue_id}`, jwt, {
    method: "GET",
  })) as Issue;

  const paper = (await fetchApi(`papers/${issue.paper_id}`, jwt, {
    method: "GET",
  })) as Paper;

  const articles = await getSubmittedArticlesForIssue(jwt, issue.id);

  return (
    <PageContainer id="issue-page">
      <PageTitle>
        {paper.name} | {issue.name}
      </PageTitle>
      <section>
        <Heading2>articles</Heading2>
        <ArticlesTable articles={articles} />
      </section>
    </PageContainer>
  );
}
