import { PageTitle } from "@/app/components/page-title/page-title";
import { redirectIfNotLoggedIn } from "@/app/utils/auth-utils";
import { Paper } from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";
import "./papers.scss";
import { TITLE_FONT } from "@/app/layout";

const PapersPage = async () => {
  const supabase = await createClient();
  await redirectIfNotLoggedIn(supabase);

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  const papers = (await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/papers`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      method: "GET",
    },
  ).then((r) => r.json())) as Paper[];

  return (
    <div id="papers-page">
      <PageTitle>my papers</PageTitle>
      <div id="papers-list">
        {papers.map((paper) => {
          return <PaperCard paper={paper} />;
        })}
      </div>
    </div>
  );
};

const PaperCard: React.FC<{ paper: Paper }> = ({ paper }) => {
  return (
    <div className="paper-card">
      <h2 className={`paper-name ${TITLE_FONT.className}`}>{paper.name}</h2>
      <span className="paper-date">
        est.{" "}
        {new Date(paper.created_at).toLocaleDateString("en-CA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  );
};

export default PapersPage;
