import { Check } from "lucide-react";
import { DINOSAURS } from "../data/dinosaurs";
import type { DemoMode, SpeciesId } from "../data/dinosaurs";
import DinoIcon from "./DinoIcon";

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
  return (
    <aside className="collection-rail" aria-label="恐龙馆藏目录">
      <div className="rail-heading">
        <h2>馆藏目录</h2>
        <p>{mode === "compare" ? "选择要比较的恐龙" : "选择一位史前居民"}</p>
      </div>
      <div className="species-list">
        {DINOSAURS.map((d) => {
          const selected =
            mode === "compare" ? comparisons.includes(d.id) : species === d.id;
          return (
            <button
              className={`species-row ${selected ? "selected" : ""}`}
              key={d.id}
              onClick={() => onSelect(d.id)}
              aria-pressed={selected}
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
          );
        })}
      </div>
      <div className="rail-note">
        <span className="note-line" />
        <p>
          原创示意模型
          <br />
          <span>外观用于交互演示</span>
        </p>
      </div>
    </aside>
  );
}
