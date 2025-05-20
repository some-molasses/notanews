import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./editing-issue.scss";
import { getIssueById } from "@/app/utils/queries";
import { Issue, IssueExpanded } from "@/app/utils/data-types";

export default async function EditingIssuePage({
  params,
}: {
  params: { issue_id: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue = await getIssueById(jwt, params.issue_id);

  return (
    <div id="editing-dash-page">
      <PageTitle>
        editing {issue.papers.name} {issue.name}
      </PageTitle>
    </div>
  );
}

const IssueStateBreadcrumb: React.FC<{ issue: Issue }> = ({ issue }) => {
  const getType = () => {
    switch (issue.state) {
      case "copyediting":
        return "copyediting";
      case "generating":
        return "drafting";
      case "writing":
      default:
        throw new Error(`Bad issue state ${issue.state}`);
    }
  };

  return (
    <div className={`issue-state-breadcrumb ${getType()}`}>
      <span className="state copyediting">copyediting</span>
      <span className="bullet">•</span>
      <span className="state drafting">drafting</span>
      <span className="bullet">•</span>
      <span className="state distributing">distrbuting</span>
    </div>
  );
};
