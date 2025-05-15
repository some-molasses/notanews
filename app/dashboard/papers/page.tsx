import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { Paper } from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";
import "./papers.scss";
import { TITLE_FONT } from "@/app/styles";
import Link from "next/link";

const PapersPage = async () => {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

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
    <Link href={`/dashboard/papers/${paper.id}`}>
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
    </Link>
  );
};

export default PapersPage;
