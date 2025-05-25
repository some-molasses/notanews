import { PageTitle } from "@/app/components/page-title/page-title";
import { Heading2 } from "@/app/components/typography/typography";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./editing-dashboard.scss";
import { fetchApi, getIssues } from "@/app/utils/queries";
import { Issue, IssueExpanded, Paper } from "@/app/utils/data-types";
import Link from "next/link";
import { Card, CardsList } from "@/app/components/cards/cards";

export default async function EditingDashboardView() {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const editableIssues: IssueExpanded[] = await getIssues(jwt, [
    "copyediting",
    "generating",
  ]);

  return (
    <div id="editing-dash-page">
      <PageTitle>editing</PageTitle>
      <section>
        <CardsList>
          {editableIssues.map((issue) => (
            <Card key={issue.id} href={`/dashboard/editing/${issue.id}`}>
              <div key={issue.id} className="issue-card">
                <h2>
                  {issue.papers.name} {issue.name}
                </h2>
                <IssueStateBreadcrumb issue={issue} />
              </div>
            </Card>
          ))}
        </CardsList>
      </section>
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
      <span className="state distributing">distributing</span>
    </div>
  );
};
