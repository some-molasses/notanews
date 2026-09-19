import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { getIssueById } from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";

export default async function DraftingIssuePage({
  params,
}: {
  params: Promise<{ issue_id: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);
  const { issue_id } = await params;

  const issue = await getIssueById(jwt, issue_id);

  return (
    <PageContainer id="issue-page">
      <PageTitle>define template for {issue.name}</PageTitle>
    </PageContainer>
  );
}
