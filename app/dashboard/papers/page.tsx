import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { Paper } from "@/app/utils/data-types";
import { createClient } from "@/app/utils/supabase/server";
import "./papers.scss";
import { TITLE_FONT } from "@/app/styles";
import Link from "next/link";
import { fetchApi } from "@/app/utils/queries";
import { Heading1 } from "@/app/components/typography/typography";

const PapersPage = async () => {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const myPapers: Paper[] = await fetchApi(`/papers`, jwt, {
    method: "GET",
  });

  const myPaperIds = myPapers.map((paper) => paper.id);

  const allPapers: Paper[] = await fetchApi(`/papers/discover`, jwt, {
    method: "GET",
  });

  const unjoinedPapers = allPapers.filter(
    (paper) => !myPaperIds.includes(paper.id),
  );

  return (
    <div id="papers-page">
      <PageTitle>my papers</PageTitle>
      <div className="papers-list">
        {myPapers.map((paper) => {
          return <PaperCard paper={paper} />;
        })}
      </div>
      <Heading1>discover papers</Heading1>
      <div className="papers-list">
        {unjoinedPapers.map((paper) => {
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
