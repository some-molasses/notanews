import { Card, CardsList } from "@/app/components/cards/cards";
import { PageContainer } from "@/app/components/page-container/page-container";
import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { Issue } from "@/app/utils/data-types";
import { getIssues } from "@/app/utils/queries";
import { createClient } from "@/app/utils/supabase/server";
import "./editing-dashboard.scss";

export default async function EditingDashboardView() {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  // @todo restrict to only editable issues
  const editableIssues: Issue[] = await getIssues(jwt);

  return (
    <PageContainer id="editing-dash-page">
      <PageTitle>editing</PageTitle>
      <section>
        <CardsList>
          {editableIssues.map((issue) => (
            <Card key={issue.id} href={`/dashboard/editing/${issue.id}`}>
              <div key={issue.id} className="issue-card">
                <h2>{issue.name}</h2>
                <IssueStateBreadcrumb issue={issue} />
              </div>
            </Card>
          ))}
        </CardsList>
      </section>
    </PageContainer>
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
        return "writing";
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
      <span className="state distributing">distributing</span>
    </div>
  );
};
