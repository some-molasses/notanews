"use client";

import { Column, Row } from "@/app/components/layout/layout-components";
import Tiptap from "@/app/components/tiptap/tiptap";
import { useState } from "react";
import {
  Article,
  ArticleExpanded,
  Issue,
  IssueExpanded,
} from "@/app/utils/data-types";
import { Button } from "@/app/components/button/button.client";
import { deleteArticle, updateArticle } from "./queries";
import { useRouter } from "next/navigation";

export const ArticleEditorClient: React.FC<{
  article: ArticleExpanded;
  eligibleIssues: IssueExpanded[];
}> = ({ article, eligibleIssues }) => {
  const router = useRouter();

  const [title, setTitle] = useState(article.title);
  const [pseudonym, setPseudonym] = useState(article.pseudonym);
  const [issue, setIssue] = useState(article.issue_id);
  const [contents, setContents] = useState(article.body);

  console.log(issue);

  const getCurrentArticle = (): Article => {
    return {
      ...article,
      title: title ?? "",
      pseudonym: pseudonym ?? "",
      body: contents,
      issue_id: issue,
    };
  };

  return (
    <div id="article-editor">
      <Column className="metadata-inputs">
        <input
          id="title-input"
          placeholder="your title here"
          value={title ?? ""}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          id="pseudonym-input"
          placeholder="a creative author name"
          value={pseudonym ?? ""}
          onChange={(event) => setPseudonym(event.target.value)}
        />
        <select
          id="issue-select"
          defaultValue={article.issue_id}
          onChange={(event) => setIssue(event.target.value)}
        >
          {eligibleIssues.map((issue) => (
            <option key={issue.id} value={issue.id}>
              {issue.papers.name} {issue.volume_number}.{issue.issue_number}
            </option>
          ))}
        </select>
      </Column>
      <Tiptap
        defaultContent={contents}
        onUpdate={(props) => setContents(props.editor.getHTML())}
      />
      <Row id="editor-article-buttons">
        <Button handler={() => updateArticle(getCurrentArticle())}>
          Update article
        </Button>
        <Button
          handler={() =>
            deleteArticle(getCurrentArticle(), () => {
              router.push("/dashboard");
            })
          }
          variant="destructive"
        >
          Delete article
        </Button>
      </Row>
    </div>
  );
};
