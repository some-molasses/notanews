import { PageTitle } from "@/app/components/page-title/page-title";
import { Table } from "@/app/components/table/table";
import { Heading2 } from "@/app/components/typography/typography";
import { authenticatePage } from "@/app/utils/auth-utils";
import { Issue, Paper, PaperMemberDetailed } from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";
import { RowReverse } from "@/app/components/layout/layout-components";
import { Button } from "@/app/components/button/button.server";
import { nothing } from "./queries";
import { fetchApi } from "@/app/utils/queries";
import Link from "next/link";
import "./paper.scss";
import { PaperMembersTable } from "./components/members-table";

export default async function PaperView({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

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
        <PaperMembersTable paperMembers={paper_members} />
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

const makeIssueRow = (issue: Issue, paper: Paper) => {
  return (
    <tr key={issue.id}>
      <td>
        <Link href={`/dashboard/issues/${issue.id}`}>
          <div className="cell">
            {paper.name} {issue.volume_number}.{issue.issue_number}
          </div>
        </Link>
      </td>
      <td>
        <Link href={`/dashboard/issues/${issue.id}`}>
          <div className="cell">
            {new Date(issue.created_at).toLocaleDateString("en-CA", {
              year: "numeric",
              day: "numeric",
              month: "long",
            })}
          </div>
        </Link>
      </td>
      <td>
        <Link href={`/dashboard/issues/${issue.id}`}>
          <div className="cell">
            {issue.published_at
              ? new Date(issue.published_at).toLocaleDateString("en-CA", {
                  year: "numeric",
                  day: "numeric",
                  month: "long",
                })
              : "unpublished"}
          </div>
        </Link>
      </td>
    </tr>
  );
};
