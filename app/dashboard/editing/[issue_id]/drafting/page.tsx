import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./drafting-issue.scss";
import { getIssueArticles, getIssueById } from "@/app/utils/queries";
import { DrafterClientPage } from "./drafter-client-page";

export default async function DraftingIssuePage({
  params,
}: {
  params: { issue_id: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue = await getIssueById(jwt, params.issue_id);
  const articles = await getIssueArticles(jwt, params.issue_id);

  return <DrafterClientPage issue={issue} initialArticles={articles} />;
}
