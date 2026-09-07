import {
  getArticleFrameMeasurableContents,
  POSTSCRIPT_DIVIDER_CLASSNAME,
} from "@/app/components/issue/article/article-frame";

function formatPostscript(contents: Element[]) {
  let dividerSpotted = false;
  for (const el of contents) {
    if (el.classList.contains(POSTSCRIPT_DIVIDER_CLASSNAME)) {
      dividerSpotted = true;
    }

    if (dividerSpotted) {
      el.classList.add("postscript");
    }
  }
}

export function preformatArticle(articleFrame: HTMLDivElement): void {
  const contents = getArticleFrameMeasurableContents(articleFrame);
  formatPostscript(contents);
}
