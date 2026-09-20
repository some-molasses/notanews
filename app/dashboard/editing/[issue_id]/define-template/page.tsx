import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import {
  getIssueById,
  getIssueTemplate,
  getIssueTemplateComponents,
} from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";
import { IssueTemplateForm } from "./issue-template-form";

export default async function DefineTemplatePage({
  params,
}: {
  params: Promise<{ issue_id: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);
  const { issue_id } = await params;

  const issue = await getIssueById(jwt, issue_id);
  const template = await getIssueTemplate(issue_id, jwt);
  const defaultComponents = await getIssueTemplateComponents(issue_id, jwt);

  return (
    <PageContainer id="issue-page">
      <PageTitle>define template for {issue.name}</PageTitle>
      <IssueTemplateForm
        template={template}
        defaultComponents={defaultComponents}
      />
    </PageContainer>
  );
}
