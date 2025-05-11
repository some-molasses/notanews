"use client";

import { Button } from "@/app/components/button/button.client";
import { updateArticle } from "./queries";
import { Article } from "@/app/utils/data-types";

export const UpdateArticleButton: React.FC<{
  getArticle: () => Article;
}> = ({ getArticle }) => {
  return (
    <Button handler={() => updateArticle(getArticle())}>Update article</Button>
  );
};
