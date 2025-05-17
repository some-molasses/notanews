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
import {
  deleteArticle,
  revertArticleToDraft,
  submitArticle,
  updateArticle,
} from "./queries";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useJWT } from "@/app/auth/components/jwt-context";
import { useUser } from "@/app/utils/data-util.client";

export const ArticleEditorClient: React.FC<{
  article: ArticleExpanded;
  eligibleIssues: IssueExpanded[];
  isUserAnEditor: boolean;
}> = ({ article, eligibleIssues, isUserAnEditor }) => {
  const router = useRouter();
  const jwt = useJWT();
  const user = useUser();

  const [title, setTitle] = useState(article.title);
  const [pseudonym, setPseudonym] = useState(article.pseudonym);
  const [issue, setIssue] = useState(article.issue_id);
  const [contents, setContents] = useState(article.body);

  const getCurrentArticle = (): Article => {
    const selected_issue = issue === "null" ? null : issue;

    return {
      ...article,
      title: title ?? "",
      pseudonym: pseudonym ?? "",
      body: contents,
      issue_id: selected_issue,
    };
  };

  const isEditableAsAuthor =
    user && user.id === article.user_id && article.state === "draft";
  const isEditableAsEditor = isUserAnEditor && article.state !== "draft";
  const isEditable = isEditableAsAuthor || isEditableAsEditor;

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
          contentEditable={isEditable}
        />
        <input
          id="pseudonym-input"
          placeholder="a creative author name"
          value={pseudonym ?? ""}
          onChange={(event) => setPseudonym(event.target.value)}
          contentEditable={isEditable}
        />
        {isEditableAsAuthor ? (
          <select
            id="issue-select"
            defaultValue={article.issue_id ?? "null"}
            onChange={(event) => setIssue(event.target.value)}
            contentEditable={isEditable}
          >
            <option key="none" value={"null"}>
              no issue selected
            </option>
            {eligibleIssues.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.papers.name} {issue.volume_number}.{issue.issue_number}
              </option>
            ))}
          </select>
        ) : null}
      </Column>
      <Tiptap
        defaultContent={contents}
        onUpdate={(props) => setContents(props.editor.getHTML())}
        editable={isEditable}
      />
      <Row id="editor-article-buttons">
        {isEditable ? (
          <>
            <Button
              handler={() => {
                updateArticle(getCurrentArticle(), jwt).then(() =>
                  toast("Article updated", {
                    type: "success",
                    autoClose: 2500,
                  }),
                );
              }}
            >
              Update article
            </Button>
            <Button
              handler={() =>
                submitArticle(getCurrentArticle(), jwt, () => {
                  router.push("/dashboard");
                  toast("Article submitted", {
                    type: "success",
                    autoClose: 2500,
                  });
                })
              }
            >
              Submit article
            </Button>
            <Button
              handler={() =>
                deleteArticle(getCurrentArticle(), jwt, () => {
                  router.push("/dashboard");
                  toast("Article deleted", {
                    type: "success",
                    autoClose: 2500,
                  });
                })
              }
              variant="destructive"
            >
              Delete article
            </Button>
          </>
        ) : (
          <Button
            handler={() =>
              revertArticleToDraft(getCurrentArticle(), jwt, () => {
                router.push("/dashboard");
                toast("Article reverted to draft", {
                  type: "success",
                  autoClose: 2500,
                });
              })
            }
          >
            Revert to draft
          </Button>
        )}
      </Row>
    </div>
  );
};
