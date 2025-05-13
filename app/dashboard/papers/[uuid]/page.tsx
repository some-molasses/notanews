import { PageTitle } from "@/app/components/page-title/page-title";
import { Table } from "@/app/components/table/table";
import { fetchApi, redirectIfNotLoggedIn } from "@/app/utils/auth-utils";
import {
  Paper,
  PaperMember,
  PaperMemberDetailed,
} from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";

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

  return (
    <div id="papers-page">
      <PageTitle>{paper.name}</PageTitle>
      <Table
        headers={["member", "role"]}
        data={paper_members}
        rowGenerator={makeMemberRow}
      />
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
