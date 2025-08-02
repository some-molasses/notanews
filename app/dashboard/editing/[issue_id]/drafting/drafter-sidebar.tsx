import { ArticleExpanded } from "@/app/utils/data-types";
import { last } from "@/app/utils/data-util.shared";
import {
  DragEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const DrafterSidebar: React.FC<{
  articles: ArticleExpanded[];
  setArticles: (use: ArticleExpanded[]) => void;
}> = ({ articles, setArticles }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const ulRef = useRef<HTMLUListElement | null>(null);

  const getLiList = useCallback(() => {
    const ul = document.getElementById("sidebar-article-list")!;
    return ul.querySelectorAll("li");
  }, []);

  const findInsertionPoint = useCallback(
    (ev: MouseEvent) => {
      const liList = getLiList();

      for (const li of liList) {
        if (ev.clientY < li.getBoundingClientRect().top) {
          if (ev.target === li) {
            return null;
          }

          li.classList.add("gap-above");
          return li;
        }
      }

      if (last(liList) === ev.target) {
        return null;
      }

      return "end";
    },
    [getLiList],
  );

  const clearGaps = useCallback(() => {
    const liList = getLiList();

    liList.forEach((li) => {
      li.classList.remove("gap-above");
      li.classList.remove("gap-below");
    });
  }, [getLiList]);

  const onDrag = useCallback(
    (ev: DragEvent<HTMLLIElement>) => {
      const liList = getLiList();

      clearGaps();

      const liToInsert = findInsertionPoint(ev);
      if (liToInsert instanceof HTMLElement) {
        liToInsert.classList.add("gap-above");
      } else if (liToInsert === "end") {
        last(liList)!.classList.add("gap-below");
      }
    },
    [clearGaps, findInsertionPoint, getLiList],
  );

  const onDrop = useCallback(
    (ev: DragEvent<HTMLUListElement>) => {
      const insertionPoint = findInsertionPoint(ev);

      setDraggedId(null);

      if (insertionPoint === null) {
        return;
      }

      const draggedArticle = articles.find((a) => a.id === draggedId)!;

      if (insertionPoint === "end") {
        setArticles([
          ...articles.filter((a) => a.id !== draggedId),
          draggedArticle,
        ]);
        return;
      }

      const filteredArticles = articles.filter((a) => a.id !== draggedId);

      const followingArticleId = insertionPoint.getAttribute("article-id");
      const followingArticleIndex = filteredArticles.findIndex(
        (a) => a.id === followingArticleId,
      );

      filteredArticles.splice(followingArticleIndex, 0, draggedArticle);
      setArticles(filteredArticles);
    },
    [findInsertionPoint, articles, setArticles, draggedId],
  );

  useEffect(() => {
    ulRef.current!.addEventListener("dragenter", (event) =>
      event.preventDefault(),
    );
    ulRef.current!.addEventListener("dragover", (event) =>
      event.preventDefault(),
    );
  }, []);

  return (
    <div id="drafter-sidebar">
      <ul
        id="sidebar-article-list"
        className={`${draggedId ? "drag-active" : ""}`}
        ref={ulRef}
        onDrop={onDrop}
      >
        {articles
          .filter((a) => !!a)
          .map((article) => (
            <li
              draggable
              key={article.id}
              className="article-item"
              onDrag={(ev) => {
                onDrag(ev);
                setDraggedId(article.id);
              }}
              onDragEnd={() => {
                clearGaps();
                setDraggedId(null);
              }}
              article-id={article.id}
            >
              <span className="article-title">{article.title}</span>
              <div className="item-buttons">
                <button className="move-back">🢕</button>
                <button className="move-forward">🢗</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
