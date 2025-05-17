"use client";

import { Column, Row } from "@/app/components/layout/layout-components";
import Tiptap from "@/app/components/tiptap/tiptap";
import React, { useState } from "react";
import {
  Article,
  ArticleExpanded,
  IssueExpanded,
} from "@/app/utils/data-types";
import { Button } from "@/app/components/button/button.client";
import {
  approveArticle,
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
        {isUserAnEditor && isEditableAsEditor ? (
          <EditorButtons article={getCurrentArticle()} />
        ) : (
          <AuthorButtons
            article={getCurrentArticle()}
            isEditableByAuthor={!!isEditableAsAuthor}
          />
        )}
      </Row>
    </div>
  );
};

const AuthorButtons: React.FC<{
  article: Article;
  isEditableByAuthor: boolean;
}> = ({ isEditableByAuthor, article }) => {
  const router = useRouter();
  const jwt = useJWT();

  if (!jwt) {
    return null;
  }

  if (!isEditableByAuthor) {
    return (
      <Button
        handler={() =>
          revertArticleToDraft(article, jwt, () => {
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
    );
  }

  return (
    <>
      <Button
        handler={() => {
          updateArticle(article, jwt).then(() =>
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
          submitArticle(article, jwt, () => {
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
          deleteArticle(article, jwt, () => {
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
  );
};

const EditorButtons: React.FC<{ article: Article }> = ({ article }) => {
  const router = useRouter();
  const jwt = useJWT();

  if (!jwt) {
    return null;
  }

  return (
    <>
      <Button
        handler={() =>
          approveArticle(article, jwt).then(() => {
            router.push(`/dashboard/issues/${article.issue_id}`);
            toast("Article approved", {
              type: "success",
              autoClose: 2500,
            });
          })
        }
      >
        Approve article
      </Button>
    </>
  );
};
