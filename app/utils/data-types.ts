export type ArticleState = "draft" | "pending" | "approved" | "rejected";

/**
 * Be sure to cross-reference any updates to this schema with the version currently live in the DB
 */
export type Article = {
  id: string;
  user_id: string;
  issue_id: string | null;
  state: ArticleState;

  title: string | null;
  body: string | null;
  pseudonym: string | null;
  postscript: string | null;

  created_at: string;
  updated_at: string;
};

export type ArticleExpanded = Article & {
  issues: {
    issue_number: number;
    volume_number: number;

    papers: {
      name: string;
    };
  };
};

export type Issue = {
  id: string;
  paper_id: string;

  issue_number: number;
  volume_number: number;

  created_at: string;
  published_at: string;
};

export type IssueExpanded = Issue & { papers: { name: string } };

export type Paper = {
  id: string;
  created_at: string;
  name: string;
};

export type PaperMember = {
  id: string;
  paper_id: string;
  user_id: string;
  type: "contributor" | "editor";
};

export type PaperMemberDetailed = PaperMember & {
  email: string;
};
