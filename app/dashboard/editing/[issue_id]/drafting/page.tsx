import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./drafting-issue.scss";
import { getIssueById } from "@/app/utils/queries";

export default async function EditingIssuePage({
  params,
}: {
  params: { issue_id: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue = await getIssueById(jwt, params.issue_id);

  return (
    <div id="editing-issue-page">
      <PageTitle>
        drafting {issue.papers.name} {issue.name}
      </PageTitle>
    </div>
  );
}
