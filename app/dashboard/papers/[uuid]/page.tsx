import { PageTitle } from "@/app/components/page-title/page-title";
import { redirectIfNotLoggedIn } from "@/app/utils/auth-utils";
import { Paper } from "@/app/utils/data-types";
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

  const paper_id = (await params).uuid;

  const papers = (await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/papers/${paper_id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      method: "GET",
    },
  ).then((r) => r.json())) as Paper[];
  const paper = papers[0];

  return (
    <div id="papers-page">
      <PageTitle>{paper.name}</PageTitle>
    </div>
  );
}
