import { Article, ArticleExpanded } from "@/app/utils/data-types";
import Link from "next/link";
import "./articles-table.scss";
import { Table } from "@/app/components/table/table";
import { isUserAnEditor } from "@/app/utils/data-util.shared";
import { createClient } from "@/app/utils/supabase/server";
import { getJWT } from "@/app/utils/auth-utils";

export const ArticlesTable: React.FC<{ articles: ArticleExpanded[] }> = ({
  articles,
}) => {
  return (
    <div id="articles-table-container">
      <Table
        id="articles-table"
        headers={["title", "author", "issue", "state", "date"]}
        data={articles}
        rowGenerator={makeArticleRow}
      ></Table>
    </div>
  );
};

const makeArticleRow = async (article: ArticleExpanded) => {
  const supabase = await createClient();
  const jwt = await getJWT(supabase);
  const { data: user_data, error } = await supabase.auth.getUser();
  const user = user_data.user;

  const canViewAsAuthor = user && user.id === article.user_id;
  const canViewAsEditor = !!(
    jwt && (await isUserAnEditor(article.issues.papers.id, jwt))
  );

  const canView = canViewAsAuthor || canViewAsEditor;

  return (
    <tr key={article.id} className={canView ? "viewable" : ""}>
      <td>
        <ArticleLink article={article} viewable={canView}>
          {article.title}
        </ArticleLink>
      </td>
      <td>
        <ArticleLink article={article} viewable={canView}>
          {article.pseudonym}
        </ArticleLink>
      </td>
      <td>
        <ArticleLink article={article} viewable={canView}>
          {article.issues?.papers
            ? `${article.issues.papers.name} ${article.issues.volume_number}.${article.issues.issue_number}`
            : "-"}
        </ArticleLink>
      </td>
      <td>
        <ArticleLink
          article={article}
          viewable={canView}
          className={`state-${article.state.toLowerCase()}`}
        >
          {article.state}
        </ArticleLink>
      </td>
      <td>
        <ArticleLink article={article} viewable={canView}>
          {new Date(article.created_at)
            .toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toLowerCase()}
        </ArticleLink>
      </td>
    </tr>
  );
};

async function ArticleLink(props: {
  children: React.ReactNode;
  className?: string;
  article: ArticleExpanded;
  viewable: boolean;
}) {
  const { children, className, article, viewable } = props;

  if (viewable) {
    return (
      <Link
        href={`/dashboard/article/${article.id}`}
        className={`cell ${className ?? ""} viewable`}
      >
        {children}
      </Link>
    );
  }

  return <div className={`cell ${className ?? ""}`}>{children}</div>;
}
