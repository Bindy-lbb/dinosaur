import { useEffect, useRef } from "react";
import { ArrowUpRight, Check, Compass, X } from "lucide-react";
import { DINOSAURS } from "../data/dinosaurs";
import type { SpeciesId } from "../data/dinosaurs";
import { useLearningProgress } from "../data/learningStore";

export default function ExplorationJournal({
  onSelectSpecies,
  onClose,
}: {
  onSelectSpecies: (id: SpeciesId) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const progress = useLearningProgress();
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  const viewed = DINOSAURS.filter((d) => progress.viewed.includes(d.id)).length;
  const read = DINOSAURS.reduce(
    (sum, d) =>
      sum +
      d.hotspots.filter((h) => progress.hotspots[d.id]?.includes(h.id)).length,
    0,
  );
  const total = DINOSAURS.reduce((sum, d) => sum + d.hotspots.length, 0);
  const quizzes = DINOSAURS.filter((d) =>
    progress.quizzes.includes(d.id),
  ).length;
  const routes = [
    {
      title: "认识植食者",
      description: "观察角、甲板与取食工具。",
      species: DINOSAURS.filter((d) => d.diet.includes("植食")).slice(0, 3),
    },
    {
      title: "巨型掠食者",
      description: "比较体型，读懂不同的捕食方式。",
      species: DINOSAURS.filter(
        (d) => d.diet.includes("肉食") && d.length >= 10,
      ).slice(0, 3),
    },
  ].filter((route) => route.species.length > 0);
  const select = (id: SpeciesId) => {
    onSelectSpecies(id);
    onClose();
  };
  return (
    <dialog
      ref={dialog}
      className="exploration-journal"
      aria-labelledby="journal-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        className="journal-close"
        onClick={onClose}
        aria-label="关闭探索手记"
        autoFocus
      >
        <X size={22} />
      </button>
      <div className="journal-heading">
        <span>
          <Compass size={17} /> 我的自然观察
        </span>
        <h2 id="journal-title">探索手记</h2>
        <p>一次观察，积累一点对史前世界的认识。</p>
      </div>
      <div className="journal-stats">
        <div>
          <strong>
            {viewed}
            <small> / {DINOSAURS.length}</small>
          </strong>
          <span>已看标本</span>
        </div>
        <div>
          <strong>
            {read}
            <small> / {total}</small>
          </strong>
          <span>已读知识点</span>
        </div>
        <div>
          <strong>
            {quizzes}
            <small> / {DINOSAURS.length}</small>
          </strong>
          <span>答对小测验</span>
        </div>
      </div>
      <h3>从一条路线开始</h3>
      <div className="journal-routes">
        {routes.map((route) => {
          const done = route.species.filter(
            (d) =>
              d.hotspots.every((h) =>
                progress.hotspots[d.id]?.includes(h.id),
              ) && progress.quizzes.includes(d.id),
          ).length;
          const next = route.species.find(
            (d) =>
              !d.hotspots.every((h) =>
                progress.hotspots[d.id]?.includes(h.id),
              ) || !progress.quizzes.includes(d.id),
          );
          return (
            <article key={route.title}>
              <div className="route-title">
                <h4>{route.title}</h4>
                <span>
                  {done} / {route.species.length}
                </span>
              </div>
              <p>{route.description}</p>
              <div className="route-species">
                {route.species.map((d) => (
                  <button key={d.id} onClick={() => select(d.id)}>
                    {d.name}
                    <ArrowUpRight size={12} />
                  </button>
                ))}
              </div>
              <progress
                value={done}
                max={route.species.length}
                aria-label={`${route.title}完成进度`}
              />
              {next ? (
                <p className="route-next">
                  下一步：选择{next.name}
                  ，在「科普探索」中读完知识点并答对测验。
                </p>
              ) : (
                <p className="route-next">
                  <Check size={14} /> 已读完这条路线的知识点，并答对全部测验。
                </p>
              )}
            </article>
          );
        })}
      </div>
      <h3>馆藏观察记录</h3>
      <div className="journal-specimens">
        {DINOSAURS.map((d) => {
          const count = d.hotspots.filter((h) =>
            progress.hotspots[d.id]?.includes(h.id),
          ).length;
          return (
            <button
              key={d.id}
              onClick={() => select(d.id)}
              aria-label={`选择标本${d.name}`}
            >
              <span>
                <strong>{d.name}</strong>
                <small>
                  {progress.viewed.includes(d.id) ? "已看标本" : "尚未查看"}
                </small>
              </span>
              <span className="journal-specimen-status">
                知识 {count}/{d.hotspots.length}
                <small>
                  {progress.quizzes.includes(d.id)
                    ? "测验已答对 ✓"
                    : "测验待完成"}
                </small>
              </span>
              <ArrowUpRight size={16} />
            </button>
          );
        })}
      </div>
      <p className="journal-local-note">
        记录保存在当前浏览器；清理浏览器数据后会重置。浏览器禁用存储时，仅保留本次访问的记录。
      </p>
    </dialog>
  );
}
