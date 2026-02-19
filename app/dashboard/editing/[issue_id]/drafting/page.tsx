import { authenticatePage } from "@/app/utils/auth-utils";
import { getIssueArticles, getIssueById } from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";
import { DrafterClientPage } from "./drafter-client-page";
import "./drafting-issue.scss";

export default async function DraftingIssuePage({
  params,
}: {
  params: Promise<{ issue_id: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);
  const { issue_id } = await params;

  const issue = await getIssueById(jwt, issue_id);
  const articles = await getIssueArticles(jwt, issue_id);

  return <DrafterClientPage issue={issue} initialArticles={articles} />;
}
