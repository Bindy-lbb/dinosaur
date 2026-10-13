import {
  BookOpen,
  Check,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DINOSAURS } from "../data/dinosaurs";
import type { DemoMode, SpeciesId } from "../data/dinosaurs";
import { SPECIES_PROFILES } from "../data/speciesProfiles";
import { toggleFavorite, useLearningProgress } from "../data/learningStore";
import DinoIcon from "./DinoIcon";
import ExplorationJournal from "./ExplorationJournal";
import "../catalog.css";

export default function CollectionRail({
  mode,
  species,
  comparisons,
  onSelect,
}: {
  mode: DemoMode;
  species: SpeciesId;
  comparisons: SpeciesId[];
  onSelect: (id: SpeciesId) => void;
}) {
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("");
  const [diet, setDiet] = useState("");
  const [group, setGroup] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const progress = useLearningProgress();
  const periods = [...new Set(DINOSAURS.map((d) => d.period))];
  const diets = [...new Set(DINOSAURS.map((d) => d.diet))];
  const groups = [
    ...new Set(DINOSAURS.map((d) => SPECIES_PROFILES[d.id]?.group || "恐龙")),
  ];
  const search = query.trim().toLocaleLowerCase();
  const filtered = DINOSAURS.filter(
    (d) =>
      (!search ||
        `${d.name} ${d.latin}`.toLocaleLowerCase().includes(search)) &&
      (!period || d.period === period) &&
      (!diet || d.diet === diet) &&
      (!group || (SPECIES_PROFILES[d.id]?.group || "恐龙") === group) &&
      (!favoritesOnly || progress.favorites.includes(d.id)),
  );
  const filterCount = [period, diet, group].filter(Boolean).length;
  const resetFilters = () => {
    setQuery("");
    setPeriod("");
    setDiet("");
    setGroup("");
    setFavoritesOnly(false);
  };
  useEffect(() => {
    if (mode === "compare") return;
    const container = list.current;
    const selected = container?.querySelector<HTMLButtonElement>(".selected");
    if (!container || !selected) return;
    const row = selected.getBoundingClientRect();
    const rail = container.getBoundingClientRect();
    // Reveal direct-link selections inside the rail without scrolling the page.
    if (row.right > rail.right || row.left < rail.left)
      container.scrollLeft += row.left - rail.left - 18;
    if (row.bottom > rail.bottom || row.top < rail.top)
      container.scrollTop += row.top - rail.top;
  }, [mode, species, query, period, diet, group, favoritesOnly]);
  return (
    <aside
      className="collection-rail catalog-enhanced"
      aria-label="史前生物馆藏目录"
    >
      <div className="rail-heading">
        <h2>馆藏目录</h2>
        <p>{mode === "compare" ? "选择要比较的生物" : "选择一位史前居民"}</p>
      </div>
      <div className="catalog-tools">
        <div className="catalog-search">
          <Search size={15} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="搜索馆藏"
            placeholder="搜索中文名 / 拉丁名"
          />
          {query && (
            <button aria-label="清除搜索" onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="catalog-actions">
          <button
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={filterCount ? "active" : ""}
          >
            <SlidersHorizontal size={14} /> 筛选
            {filterCount ? ` · ${filterCount}` : ""}
          </button>
          <button
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={favoritesOnly ? "active" : ""}
          >
            <Star size={14} /> 已收藏
          </button>
          <span aria-live="polite">
            {filtered.length} / {DINOSAURS.length}
          </span>
        </div>
        {filtersOpen && (
          <div id="catalog-filters" className="catalog-filters">
            <label>
              年代
              <select
                aria-label="筛选年代"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                <option value="">全部年代</option>
                {periods.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              食性
              <select
                aria-label="筛选食性"
                value={diet}
                onChange={(event) => setDiet(event.target.value)}
              >
                <option value="">全部食性</option>
                {diets.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              分类
              <select
                aria-label="筛选分类"
                value={group}
                onChange={(event) => setGroup(event.target.value)}
              >
                <option value="">全部分类</option>
                {groups.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <button className="catalog-reset" onClick={resetFilters}>
              清除全部条件
            </button>
          </div>
        )}
      </div>
      <div className="species-list" ref={list}>
        {filtered.map((d) => {
          const selected =
            mode === "compare" ? comparisons.includes(d.id) : species === d.id;
          return (
            <div className="catalog-specimen" key={d.id}>
              <button
                className={`species-row ${selected ? "selected" : ""}`}
                onClick={() => onSelect(d.id)}
                aria-pressed={selected}
                title={`${d.name} · ${d.latin}`}
              >
                <span className="species-number">
                  {mode === "compare" && selected ? (
                    <Check size={17} />
                  ) : (
                    d.number
                  )}
                </span>
                <span className="species-copy">
                  <strong>{d.name}</strong>
                  <em>{d.latin}</em>
                </span>
                <DinoIcon species={d.id} />
              </button>
              <button
                className={`catalog-favorite ${progress.favorites.includes(d.id) ? "is-favorite" : ""}`}
                aria-label={`${progress.favorites.includes(d.id) ? "取消收藏" : "收藏"}${d.name}`}
                aria-pressed={progress.favorites.includes(d.id)}
                onClick={() => toggleFavorite(d.id)}
                title={`${progress.favorites.includes(d.id) ? "取消收藏" : "收藏"}${d.name}`}
              >
                <Star
                  size={15}
                  fill={
                    progress.favorites.includes(d.id) ? "currentColor" : "none"
                  }
                />
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="catalog-empty">
            <p>没有符合条件的标本</p>
            <span>
              {favoritesOnly
                ? "可以点击标本旁的星标，建立你的收藏。"
                : "试试其他名称，或放宽筛选条件。"}
            </span>
            <button onClick={resetFilters}>查看全部馆藏</button>
          </div>
        )}
      </div>
      <button className="journal-trigger" onClick={() => setJournalOpen(true)}>
        <BookOpen size={16} />
        <span>探索手记</span>
        <small>
          已看 {DINOSAURS.filter((d) => progress.viewed.includes(d.id)).length}/
          {DINOSAURS.length}
        </small>
      </button>
      <div className="rail-note">
        <span className="note-line" />
        <p>
          数字标本 · 艺术复原
          <br />
          <span>CC BY 授权 · 艺术复原</span>
        </p>
      </div>
      {journalOpen && (
        <ExplorationJournal
          onSelectSpecies={onSelect}
          onClose={() => setJournalOpen(false)}
        />
      )}
    </aside>
  );
}
