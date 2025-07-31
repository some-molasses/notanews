import { PageTitle } from "@/app/components/page-title/page-title";
import { authenticatePage } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/server";
import "./drafting-issue.scss";
import { getIssueArticles, getIssueById } from "@/app/utils/queries";
import { Drafter } from "./drafter";
import { PageContainer } from "@/app/components/page-container/page-container";
import { ArticleExpanded } from "@/app/utils/data-types";

export default async function DraftingIssuePage({
  params,
}: {
  params: { issue_id: string };
}) {
  const supabase = await createClient();
  const { jwt } = await authenticatePage(supabase);

  const issue = await getIssueById(jwt, params.issue_id);
  const articles = await getIssueArticles(jwt, params.issue_id);

  return (
    <PageContainer
      id="drafting-issue-page"
      rightNav={<DrafterSidebar articles={articles} />}
    >
      {articles.length === 0 ? (
        <PageTitle>
          no articles in {issue.papers.name} {issue.name}
        </PageTitle>
      ) : null}
      <Drafter articles={articles} />
    </PageContainer>
  );
}

const DrafterSidebar: React.FC<{ articles: ArticleExpanded[] }> = ({
  articles,
}) => {
  return (
    <div id="drafter-sidebar">
      <ul id="sidebar-article-list">
        {articles.map((article) => (
          <li key={article.id} className="article-item">
            <span className="article-title">{article.title}</span>
            <div className="item-buttons">
              <button className="move-back">🢕</button>
              <button className="move-forward">🢗</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
