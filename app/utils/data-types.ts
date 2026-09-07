export type ArticleState = "draft" | "pending" | "approved" | "rejected";

/**
 * Be sure to cross-reference any updates to this schema with the version currently live in the DB
 */
export type ArticleData = {
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

export function enrichArticles(articles: ArticleData[]): Article[] {
  return articles.map((a) => new Article(a));
}

export function serializeArticles(articles: Article[]): ArticleData[] {
  return articles.map((a) => a.serialize());
}

export class Article {
  private data: ArticleData;

  constructor(data: ArticleData) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get title() {
    return this.data.title;
  }

  get pseudonym() {
    return this.data.pseudonym;
  }

  get user_id() {
    return this.data.user_id;
  }

  get issue_id() {
    return this.data.issue_id;
  }

  get state() {
    return this.data.state;
  }

  get created_at() {
    return this.data.created_at;
  }

  get updated_at() {
    return this.data.updated_at;
  }

  get body() {
    return this.data.body;
  }

  get postscript() {
    return this.data.postscript;
  }

  serialize() {
    return this.data;
  }
}

export type ArticleDataExpanded = ArticleData & {
  issues?: {
    name: string;

    papers: {
      name: string;
      id: string;
    };
  };
};

export class ArticleExpanded extends Article {
  issues: ArticleDataExpanded["issues"];

  constructor(expandedData: ArticleDataExpanded) {
    super(expandedData);

    this.issues = expandedData.issues;
  }

  serialize(): ArticleDataExpanded {
    return {
      ...super.serialize(),
      issues: this.issues,
    };
  }
}

export type IssueState = "writing" | "copyediting" | "generating" | "published";

export type Issue = {
  id: string;
  paper_id: string;

  name: string;
  state: IssueState;

  created_at: string;
  submission_deadline: string;
  published_at: string;
};

export type IssueExpanded = Issue & { papers: { name: string } };

export type Paper = {
  id: string;
  created_at: string;
  name: string;
};

export type MembershipTypes = "contributor" | "editor";

export type PaperMember = {
  id: string;
  paper_id: string;
  user_id: string;
  type: MembershipTypes;
};

export type PaperMemberDetailed = PaperMember & {
  email: string;
};

export type UserProfile = {
  id: string;
  email: string;
};
