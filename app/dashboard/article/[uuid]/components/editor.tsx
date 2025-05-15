"use client";

import { Column, Row } from "@/app/components/layout/layout-components";
import Tiptap from "@/app/components/tiptap/tiptap";
import { useState } from "react";
import {
  Article,
  ArticleExpanded,
  IssueExpanded,
} from "@/app/utils/data-types";
import { Button } from "@/app/components/button/button.client";
import { deleteArticle, submitArticle, updateArticle } from "./queries";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { useJWT } from "@/app/auth/components/jwt-context";

export const ArticleEditorClient: React.FC<{
  article: ArticleExpanded;
  eligibleIssues: IssueExpanded[];
}> = ({ article, eligibleIssues }) => {
  const router = useRouter();
  const jwt = useJWT();

  const [title, setTitle] = useState(article.title);
  const [pseudonym, setPseudonym] = useState(article.pseudonym);
  const [issue, setIssue] = useState(article.issue_id);
  const [contents, setContents] = useState(article.body);

  const getCurrentArticle = (): Article => {
    return {
      ...article,
      title: title ?? "",
      pseudonym: pseudonym ?? "",
      body: contents,
      issue_id: issue,
    };
  };

  if (!jwt) {
    return null;
  }

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
        <Button
          handler={() => {
            updateArticle(getCurrentArticle(), jwt).then(() =>
              toast("Article updated", { type: "success", autoClose: 2500 }),
            );
          }}
        >
          Update article
        </Button>
        <Button
          handler={() =>
            submitArticle(getCurrentArticle(), jwt, () => {
              router.push("/dashboard");
              toast("Article submitted", { type: "success", autoClose: 2500 });
            })
          }
        >
          Submit article
        </Button>
        <Button
          handler={() =>
            deleteArticle(getCurrentArticle(), jwt, () => {
              router.push("/dashboard");
              toast("Article deleted", { type: "success", autoClose: 2500 });
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
