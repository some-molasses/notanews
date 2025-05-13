import { PageTitle } from "@/app/components/page-title/page-title";
import { Table } from "@/app/components/table/table";
import { Heading2 } from "@/app/components/typography/typography";
import { fetchApi, redirectIfNotLoggedIn } from "@/app/utils/auth-utils";
import { Issue, Paper, PaperMemberDetailed } from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";
import "./paper.scss";
import { Row, RowReverse } from "@/app/components/layout/layout-components";
import { Button } from "@/app/components/button/button.server";
import { nothing } from "./actions";

export default async function PaperView({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const supabase = await createClient();
  await redirectIfNotLoggedIn(supabase);

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  if (!jwt) {
    throw new Error("No JWT");
  }

  const paper_id = (await params).uuid;

  const paper = (await fetchApi(`papers/${paper_id}`, jwt, {
    method: "GET",
  })) as Paper;

  const paper_members = (await fetchApi(`papers/${paper_id}/members`, jwt, {
    method: "GET",
  })) as PaperMemberDetailed[];

  const paper_issues = (await fetchApi(`papers/${paper_id}/issues`, jwt, {
    method: "GET",
  })) as Issue[];

  return (
    <div id="papers-page">
      <PageTitle>{paper.name}</PageTitle>
      <section>
        <Heading2>members</Heading2>
        <Table
          headers={["member", "role"]}
          data={paper_members}
          rowGenerator={makeMemberRow}
        />
        <RowReverse>
          <Button handler={nothing}>Invite new member</Button>
        </RowReverse>
      </section>
      <section>
        <Heading2>issues</Heading2>
        <Table
          headers={["issue", "creation date", "publication date"]}
          data={paper_issues}
          rowGenerator={(issue) => makeIssueRow(issue, paper)}
        />
        <RowReverse className="issue-buttons">
          <Button handler={nothing}>Create new issue</Button>
        </RowReverse>
      </section>
    </div>
  );
}

const makeMemberRow = (paperMember: PaperMemberDetailed) => {
  return (
    <tr key={paperMember.id}>
      <td>
        <div className="cell">{paperMember.email}</div>
      </td>
      <td>
        <div className="cell">{paperMember.type}</div>
      </td>
    </tr>
  );
};

const makeIssueRow = (issue: Issue, paper: Paper) => {
  return (
    <tr key={issue.id}>
      <td>
        <div className="cell">
          {paper.name} {issue.volume_number}.{issue.issue_number}
        </div>
      </td>
      <td>
        <div className="cell">
          {new Date(issue.created_at).toLocaleDateString("en-CA", {
            year: "numeric",
            day: "numeric",
            month: "long",
          })}
        </div>
      </td>
      <td>
        <div className="cell">
          {issue.published_at
            ? new Date(issue.published_at).toLocaleDateString("en-CA", {
                year: "numeric",
                day: "numeric",
                month: "long",
              })
            : "unpublished"}
        </div>
      </td>
    </tr>
  );
};
