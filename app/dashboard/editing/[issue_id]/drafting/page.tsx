import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./drafting-issue.scss";
import { getIssueArticles, getIssueById } from "@/app/utils/queries";
import { ArticlesViewer } from "./articles-viewer";

export default async function DraftingIssuePage({
  params,
}: {
  params: { issue_id: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue = await getIssueById(jwt, params.issue_id);
  const articles = await getIssueArticles(jwt, params.issue_id);

  return (
    <div id="drafting-issue-page">
      {articles.length === 0 ? (
        <PageTitle>
          no articles in {issue.papers.name} {issue.name}
        </PageTitle>
      ) : null}
      <ArticlesViewer articles={articles} />
    </div>
  );
}
