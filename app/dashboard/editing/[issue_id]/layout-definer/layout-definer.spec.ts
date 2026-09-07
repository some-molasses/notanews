import { constructLayout } from "./layout-definer";
import { ARTICLE_INNER_MAX_HEIGHT_PX } from "@/app/components/issue/article/article-frame";
import { ArticleMeasurements } from "../measurer/measurer";

// Helper to mock ArticleMeasurements objects
const createMockArticle = (
  id: string,
  columnHeights: number[],
): ArticleMeasurements => {
  return {
    article_id: id,
    columns: columnHeights.map((height) => ({
      height,
      contents: `Content for ${id}`,
    })),
  } as unknown as ArticleMeasurements;
};

describe("layout-definer constructLayout", () => {
  test("places a multi-column article at the start of a run", () => {
    // 1 multi-col article using heights derived from ARTICLE_INNER_MAX_HEIGHT_PX
    const colHeight = Math.floor(ARTICLE_INNER_MAX_HEIGHT_PX / 2);
    const multiColArticle = createMockArticle("multi-1", [
      colHeight,
      colHeight,
    ]);
    const articles = [multiColArticle];

    const result = constructLayout(articles);

    expect(result.length).toBe(1);
    expect(result[0].articles.length).toBe(1);
    expect(result[0].articles[0].article_id).toBe("multi-1");
    expect(result[0].articles[0].columns.length).toBe(2);
  });

  test("prioritizes multi-column articles over single-column articles when starting a new run", () => {
    const colHeight = Math.floor(ARTICLE_INNER_MAX_HEIGHT_PX / 2);
    const singleColArticle = createMockArticle("single-1", [colHeight]);
    const multiColArticle = createMockArticle("multi-1", [
      colHeight,
      colHeight,
    ]);

    // Pass single-column first in input array
    const articles = [singleColArticle, multiColArticle];

    const result = constructLayout(articles);

    // First run should pick up multiColArticle as its lead article
    expect(result[0].articles[0].article_id).toBe("multi-1");
  });

  test("restricts next run to max 1 column if previous run's lead article had an odd number of columns", () => {
    const colHeight = Math.floor(ARTICLE_INNER_MAX_HEIGHT_PX / 3);

    // Lead article has 3 columns (odd number) -> forces next run's maxColumns to 1
    const multiCol3 = createMockArticle("multi-3col", [
      colHeight,
      colHeight,
      colHeight,
    ]);
    const multiCol2 = createMockArticle("multi-2col", [colHeight, colHeight]);
    const singleCol = createMockArticle("single-1", [
      ARTICLE_INNER_MAX_HEIGHT_PX,
    ]);

    const articles = [multiCol3, multiCol2, singleCol];

    const result = constructLayout(articles);

    // Expect at least 2 runs created
    expect(result.length).toBeGreaterThanOrEqual(2);

    // First run starts with the 3-column article
    expect(result[0].articles[0].article_id).toBe("multi-3col");

    // Second run should NOT pick up multiCol2 because maxColumns was forced to 1 by commitRun
    expect(result[1].articles[0].article_id).toBe("single-1");
  });

  test("stacks single column articles until exceeding ARTICLE_INNER_MAX_HEIGHT_PX", () => {
    const halfMaxHeight = Math.floor(ARTICLE_INNER_MAX_HEIGHT_PX / 2);

    // Two articles that fit together, and one that forces a new commit/run
    const article1 = createMockArticle("single-1", [halfMaxHeight]);
    const article2 = createMockArticle("single-2", [halfMaxHeight]);
    const article3 = createMockArticle("single-3", [halfMaxHeight]);

    const result = constructLayout([article1, article2, article3]);

    // Run 1 gets article1 and article2 (totals 100% of max height)
    expect(result[0].articles.map((a) => a.article_id)).toEqual([
      "single-1",
      "single-2",
    ]);

    // Run 2 gets article3 since it exceeded remaining column capacity
    expect(result[1].articles.map((a) => a.article_id)).toEqual(["single-3"]);
  });
});
