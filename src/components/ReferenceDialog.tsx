import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { DINOSAURS, getDinosaur } from "../data/dinosaurs";
import type { SpeciesId } from "../data/dinosaurs";

const DIRECTION: Record<SpeciesId, { focus: string; details: string[] }> = {
  triceratops: {
    focus: "厚重的躯干，角与颈盾的力量感。",
    details: [
      "宽阔的头骨与薄而宽的颈盾自然衔接",
      "较小的眼睛、狭窄的喙与粗壮的四肢",
      "细鳞、关节褶皱和低饱和的自然肤色",
    ],
  },
  tyrannosaurus: {
    focus: "水平平衡的身体，强壮的头颌与后肢。",
    details: [
      "头部保留骨骼结构感，避免圆润的玩具脸",
      "短前肢、两根手指与悬空的长尾",
      "皮肤和颜色为艺术推测，不指定影视造型",
    ],
  },
  brachiosaurus: {
    focus: "高肩长颈，沉稳的巨型植食动物。",
    details: [
      "前肢较长，肩部高于躯干后部",
      "长颈连接小头，减少夸张的大眼睛",
      "骨骼材料不完整，外观复原保留不确定性",
    ],
  },
};

export default function ReferenceDialog({
  initialSpecies,
  onClose,
}: {
  initialSpecies: SpeciesId;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [species, setSpecies] = useState(initialSpecies);
  const dino = getDinosaur(species),
    direction = DIRECTION[species];
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="reference-dialog"
      aria-labelledby="reference-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="dialog-close"
        onClick={onClose}
        aria-label="关闭图例参考"
        autoFocus
      >
        <X size={22} />
      </button>
      <div className="reference-header">
        <h2 id="reference-title">向真实的史前世界靠近</h2>
        <p>博物馆式复原方向 · 图例与比例参考</p>
      </div>
      <nav className="reference-tabs" aria-label="选择参考物种">
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
      <div className="reference-layout">
        <figure className="reference-image">
          <img
            src={`/references/${species}.png`}
            alt={`${dino.name}的写实外观方向参考，AI 生成的艺术复原图`}
          />
          <figcaption>
            AI
            生成的艺术复原图，用于视觉方向参考；尚未经过专业科学审核。这是一张参考图，交互模型在展馆中。
          </figcaption>
        </figure>
        <div className="reference-details">
          <h3>
            {dino.name}
            <em>{dino.latin}</em>
          </h3>
          <p className="reference-focus">{direction.focus}</p>
          <ul>
            {direction.details.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h4>继续查阅</h4>
          <div className="reference-sources">
            <a href={dino.source} target="_blank" rel="noreferrer">
              <strong>自然历史博物馆</strong>
              <span>物种知识与代表性尺寸</span>
              <ExternalLink size={14} />
            </a>
            <a
              href={`https://dinosaurpictures.org/${dino.latin}-pictures`}
              target="_blank"
              rel="noreferrer"
            >
              <strong>Dinosaur Pictures</strong>
              <span>多种外观图例，需追溯原作者</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://www.skeletaldrawing.com/"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Scott Hartman</strong>
              <span>骨骼轮廓、比例与复原说明</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://www.amnh.org/dinosaurs/types-of-dinosaurs"
              target="_blank"
              rel="noreferrer"
            >
              <strong>美国自然历史博物馆</strong>
              <span>化石与展馆中的身体结构</span>
              <ExternalLink size={14} />
            </a>
          </div>
          <p className="reference-rights">
            第三方资料以链接提供。原始插画、照片与模型的商用、转载或 AI
            输入权限需分别核对。
          </p>
        </div>
      </div>
    </dialog>
  );
}
