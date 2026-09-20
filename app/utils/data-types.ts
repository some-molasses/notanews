import { Constants } from "@/database.types";
import { z } from "zod";

const BaseModel = z.object({
  created_at: z.string(),
  updated_at: z.string(),
});

export const ArticleStateSchema = z.enum([
  "draft",
  "pending",
  "copyediting",
  "approved",
]);
export type ArticleState = z.infer<typeof ArticleStateSchema>;

export const ArticleSchema = z.object({
  ...BaseModel.shape,
  id: z.uuid(),
  user_id: z.uuid(),
  issue_id: z.uuid().nullable(),
  state: ArticleStateSchema,

  title: z.string().nullable(),
  body: z.string().nullable(),
  pseudonym: z.string().nullable(),
  postscript: z.string().nullable(),
});

/**
 * Be sure to cross-reference any updates to this schema with the version currently live in the DB
 */
export type ArticleData = z.infer<typeof ArticleSchema>;

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

export const IssueStateSchema = z.enum([
  "writing",
  "copyediting",
  "generating",
  "published",
]);
export type IssueState = z.infer<typeof IssueStateSchema>;

export type IssueData = {
  id: string;
  paper_id: string;

  name: string;
  state: IssueState;

  created_at: string;
  submission_deadline: string;
  published_at: string;
};

export class Issue {
  private issue: IssueData;
  private paper: Paper;

  constructor(issue: IssueData, paper: Paper) {
    this.issue = issue;
    this.paper = paper;
  }

  get id() {
    return this.issue.id;
  }

  get paper_id() {
    return this.issue.paper_id;
  }

  get name() {
    return `${this.paper_name} | ${this.issue_name}`;
  }

  get issue_name() {
    return this.issue.name;
  }

  get paper_name() {
    return this.paper.name;
  }

  get state() {
    return this.issue.state;
  }

  get submission_deadline() {
    return this.issue.submission_deadline;
  }

  get created_at() {
    return this.issue.created_at;
  }

  get published_at() {
    return this.issue.published_at;
  }
}

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

export const IssueTemplateSchema = z.object({
  id: z.uuid(),
  issue_id: z.uuid(),
});
export type IssueTemplate = z.infer<typeof IssueTemplateSchema>;

export const IssueTemplatePluralitySchema = z.enum(
  Constants.public.Enums["template-component-plurality"],
);
export const IssueTemplateComponentSchema = z.object({
  id: z.uuid(),
  issue_template_id: z.uuid(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  plurality: IssueTemplatePluralitySchema,
});
export type IssueTemplateComponent = z.infer<
  typeof IssueTemplateComponentSchema
>;
