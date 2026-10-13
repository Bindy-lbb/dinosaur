import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { DINOSAURS, getDinosaur } from "../data/dinosaurs";
import type { SpeciesId } from "../data/dinosaurs";

export default function ReferenceDialog({
  initialSpecies,
  onClose,
}: {
  initialSpecies: SpeciesId;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [species, setSpecies] = useState(initialSpecies);
  const dino = getDinosaur(species);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="reference-dialog asset-dialog"
      aria-labelledby="reference-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        className="dialog-close"
        onClick={onClose}
        aria-label="关闭模型来源"
        autoFocus
      >
        <X size={22} />
      </button>
      <div className="reference-header">
        <h2 id="reference-title">每一份模型，都有来处</h2>
        <p>3D 资产作者、许可与科普资料</p>
      </div>
      <nav className="reference-tabs" aria-label="选择模型来源">
        {DINOSAURS.map((d) => (
          <button
            key={d.id}
            className={species === d.id ? "active" : ""}
            aria-pressed={species === d.id}
            onClick={() => setSpecies(d.id)}
          >
            {d.name}
          </button>
        ))}
      </nav>
      <div className="reference-details asset-details">
        <h3>
          {dino.name}
          <em>{dino.latin}</em>
        </h3>
        <p className="reference-focus">{dino.asset.title}</p>
        <p className="asset-author">作者：{dino.asset.author}</p>
        <div className="reference-sources">
          <a href={dino.asset.url} target="_blank" rel="noreferrer">
            <strong>原始模型 · Sketchfab</strong>
            <span>查看作者作品与许可</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Creative Commons Attribution 4.0</strong>
            <span>署名许可（CC BY 4.0）</span>
            <ExternalLink size={14} />
          </a>
          <a href={dino.source} target="_blank" rel="noreferrer">
            <strong>物种科普资料</strong>
            <span>物种知识与代表性尺寸</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="https://polyhaven.com/a/forest_slope"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Forest Slope · Andreas Mischok / Poly Haven</strong>
            <span>森林环境光 · CC0</span>
            <ExternalLink size={14} />
          </a>
        </div>
        <p className="reference-rights">
          模型副本来自 Objaverse
          公开归档，并与作者页面的许可核对。本站调整了显示材质、比例、朝向与灯光，部分模型简化网格、压缩贴图或重算法线；霸王龙从原场景提取并恢复为静态站姿，牛龙移除了独立岩石。详细修改记录见下方资产清单。模型属于艺术复原，颜色、软组织与姿态存在推测，科学证据说明见各物种档案。
        </p>
        <a
          className="asset-manifest-link"
          href="/models/credits.json"
          target="_blank"
          rel="noreferrer"
        >
          查看完整资产与修改清单 <ExternalLink size={14} />
        </a>
      </div>
    </dialog>
  );
}
