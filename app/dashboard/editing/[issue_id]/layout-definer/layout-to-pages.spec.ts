import { Run } from "./layout-definer";
import { layoutToPages } from "./layout-to-pages";

// Helper function to build mock runs with specified column counts per article
const createMockRun = (articleColumnCounts: number[]): Run => {
  return {
    articles: articleColumnCounts.map((colCount, articleIdx) => ({
      article_id: `art-${articleIdx + 1}`,
      columns: Array.from({ length: colCount }, (_, colIdx) => ({
        contents: `[Art${articleIdx + 1}-Col${colIdx + 1}]`,
      })),
    })),
  } as unknown as Run;
};

describe("layoutToPages", () => {
  test("returns empty array for empty layout input", () => {
    const result = layoutToPages([]);
    expect(result).toEqual([]);
  });

  test("handles single run correctly without squishing needed", () => {
    const layout = [createMockRun([2])];
    const result = layoutToPages(layout);

    expect(result.length).toBe(1);
    expect(result[0].columns).toEqual({
      left: "[Art1-Col1]",
      right: "[Art1-Col2]",
    });
  });

  test("squishes trailing left column of one run into empty right column of previous run", () => {
    // Run 1: 1 col -> Page 0: Left filled, Right empty
    // Run 2: 1 col -> Originally generates Page 1: Left filled
    // squishLastPages moves Run 2's Left into Run 1's Right and removes Page 1
    const layout = [createMockRun([1]), createMockRun([1])];
    const result = layoutToPages(layout);

    expect(result.length).toBe(1);
    expect(result[0].columns).toEqual({
      left: "[Art1-Col1]",
      right: "[Art1-Col1]",
    });
  });

  test("does NOT squish if second-to-last page already has right column content", () => {
    // Run 1: 2 cols -> Page 0: Left and Right filled
    // Run 2: 1 col -> Page 1: Left filled
    // squishLastPages cannot merge because Page 0 Right is not empty
    const layout = [createMockRun([2]), createMockRun([1])];
    const result = layoutToPages(layout);

    expect(result.length).toBe(2);
    expect(result[0].columns).toEqual({
      left: "[Art1-Col1]",
      right: "[Art1-Col2]",
    });
    expect(result[1].columns).toEqual({
      left: "[Art1-Col1]",
      right: "",
    });
  });

  test("does NOT squish if last page has right column content", () => {
    // Run 1: 1 col -> Page 0: Left filled, Right empty
    // Run 2: 2 cols -> Page 1: Left filled, Right filled
    // squishLastPages cannot merge because Run 2 spans both columns (too big to squish)
    const layout = [createMockRun([1]), createMockRun([2])];
    const result = layoutToPages(layout);

    expect(result.length).toBe(2);
    expect(result[0].columns).toEqual({
      left: "[Art1-Col1]",
      right: "",
    });
    expect(result[1].columns).toEqual({
      left: "[Art1-Col1]",
      right: "[Art1-Col2]",
    });
  });

  test("processes multiple runs in sequence with conditional squishing", () => {
    const layout = [
      createMockRun([1]), // P0: left
      createMockRun([1]), // Squished -> P0: right
      createMockRun([1]), // P1: left
      createMockRun([1]), // Squished -> P1: right
    ];
    const result = layoutToPages(layout);

    expect(result.length).toBe(2);
    expect(result[0].columns).toEqual({
      left: "[Art1-Col1]",
      right: "[Art1-Col1]",
    });
    expect(result[1].columns).toEqual({
      left: "[Art1-Col1]",
      right: "[Art1-Col1]",
    });
  });
});
