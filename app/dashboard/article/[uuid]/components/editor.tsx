"use client";

import { Column, Row } from "@/app/components/layout/layout-components";
import Tiptap from "@/app/components/tiptap/tiptap";
import { useState } from "react";
import { Article } from "@/app/utils/data-types";
import { Button } from "@/app/components/button/button.client";
import { deleteArticle, updateArticle } from "./queries";
import { useRouter } from "next/navigation";

export const ArticleEditorClient: React.FC<{ article: Article }> = ({
  article,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState(article.title);
  const [pseudonym, setPseudonym] = useState(article.pseudonym);
  const [contents, setContents] = useState(article.body);

  const getCurrentArticle = (): Article => {
    return {
      ...article,
      title: title ?? "",
      pseudonym: pseudonym ?? "",
      body: contents,
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
