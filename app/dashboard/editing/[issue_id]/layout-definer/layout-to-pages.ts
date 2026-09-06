import { Run } from "./layout-definer";

export class IssuePage {
  columns: { left: string; right: string } = {
    left: "",
    right: "",
  };
}

const runToPages = (run: Run): IssuePage[] => {
  if (run.articles.length === 0) {
    return [];
  }

  const pages: IssuePage[] = [new IssuePage()];
  pages[0].columns.left = run.articles[0].columns[0].contents;
  const lastPage = () => pages[pages.length - 1];

  // first run article MAY be multi-col
  for (let i = 1; i < run.articles[0].columns.length; i++) {
    const currentCol = run.articles[0].columns[i];
    if (!lastPage().columns.right) {
      lastPage().columns.right = currentCol.contents;
    } else {
      pages.push(new IssuePage());
      lastPage().columns.left = currentCol.contents;
    }
  }

  // after first article, rest of the articles are single-col filling in the bottom of the last one
  for (let i = 1; i < run.articles.length; i++) {
    if (run.articles[i].columns.length !== 1) {
      throw new Error(
        `Article ${run.articles[i].article_id} is not single-col; has ${run.articles[i].columns.length} columns`,
      );
    }

    if (!lastPage().columns.right) {
      lastPage().columns.left += run.articles[i].columns[0].contents;
    } else {
      lastPage().columns.right += run.articles[i].columns[0].contents;
    }
  }

  return pages;
};

const squishLastPages = (pages: IssuePage[]): IssuePage[] => {
  if (pages.length === 0) {
    return [];
  }

  // if second-last page has right contents, cannot squish
  if (pages[pages.length - 2].columns.right) {
    return pages;
  }

  // if last page has right contents, too big to squish
  if (pages[pages.length - 1].columns.right) {
    return pages;
  }

  pages[pages.length - 2].columns.right = pages[pages.length - 1].columns.left;
  pages.pop();
  return pages;
};

// each page should be 2 columns
export const layoutToPages = (layout: Run[]): IssuePage[] => {
  if (layout.length === 0) {
    return [];
  }

  const pages: IssuePage[] = [];
  for (const run of layout) {
    pages.push(...runToPages(run));
    squishLastPages(pages);
  }

  return pages;
};
