import { PageTitle } from "@/app/components/page-title/page-title";
import { Table } from "@/app/components/table/table";
import { Heading2 } from "@/app/components/typography/typography";
import { authenticatePage } from "@/app/utils/auth-utils";
import {
  Issue,
  Paper,
  PaperMember,
  PaperMemberDetailed,
} from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";
import { RowReverse } from "@/app/components/layout/layout-components";
import { Button } from "@/app/components/button/button.server";
import { nothing } from "./queries";
import { fetchApi, getPaperById } from "@/app/utils/queries";
import Link from "next/link";
import "./paper.scss";
import { PaperMembersTable } from "./components/members-table";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const getUser = async (supabase: SupabaseClient): Promise<User> => {
  const user_data = (await supabase.auth.getUser()).data;

  if (user_data === null || user_data.user === null) {
    redirect("/login");
  }

  return user_data.user;
};

const isUserMemberOfPaper = async (
  user: User,
  paper_members: PaperMember[],
) => {
  return paper_members.map((member) => member.user_id).includes(user.id!);
};

const isUserEditorOfPaper = async (
  user: User,
  paper_members: PaperMember[],
) => {
  return paper_members
    .filter((membership) => membership.type === "editor")
    .map((member) => member.user_id)
    .includes(user.id!);
};

export default async function PaperView({
  params,
}: {
  params: { uuid: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);
  const user = await getUser(supabase);

  const paper_id = params.uuid;

  const paper_members = (await fetchApi(`papers/${paper_id}/members`, jwt, {
    method: "GET",
  })) as PaperMemberDetailed[];

  // ensure only paper members can see this page
  //  @todo display a different (signup?) page for non-members
  if (!(await isUserMemberOfPaper(user, paper_members))) {
    redirect("/dashboard/papers");
  }

  const paper = await getPaperById(paper_id, jwt);

  const paper_issues = (await fetchApi(`papers/${paper_id}/issues`, jwt, {
    method: "GET",
  })) as Issue[];

  return (
    <div id="papers-page">
      <PageTitle>{paper.name}</PageTitle>
      {(await isUserEditorOfPaper(user, paper_members)) ? (
        <section>
          <Heading2>members</Heading2>
          <PaperMembersTable paperMembers={paper_members} />
          <RowReverse>
            <Button handler={nothing}>Invite new member</Button>
          </RowReverse>
        </section>
      ) : null}
      <section>
        <Heading2>issues</Heading2>
        <Table
          headers={["issue", "creation date", "publication date"]}
          data={paper_issues}
          rowGenerator={(issue) => makeIssueRow(issue, paper)}
        />
        <RowReverse className="issue-buttons">
          <Button href={`/dashboard/papers/${paper.id}/create-issue`}>
            Create new issue
          </Button>
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
            {paper.name} | {issue.name}
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
