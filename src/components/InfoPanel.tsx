import { useState } from "react";
import { ArrowRight, Check, ExternalLink, Lightbulb } from "lucide-react";
import { DINOSAURS } from "../data/dinosaurs";
import type { DemoMode, Dinosaur, SpeciesId } from "../data/dinosaurs";

interface Props {
  dino: Dinosaur;
  mode: DemoMode;
  comparisons: SpeciesId[];
  selectedHotspot: string | null;
  visited: string[];
  customName: string | null;
  onHotspot: (id: string) => void;
  onExplore: () => void;
  onClearImport: () => void;
}

function Quiz({ dino }: { dino: Dinosaur }) {
  const [open, setOpen] = useState(false),
    [answer, setAnswer] = useState<number | null>(null);
  const correct = answer === dino.question.answer;
  return (
    <div className="quiz-section">
      {!open ? (
        <button className="secondary-button" onClick={() => setOpen(true)}>
          <Lightbulb size={17} />
          来一道小测验
          <ArrowRight size={17} />
        </button>
      ) : (
        <>
          <h3>考考你的发现</h3>
          <p className="quiz-prompt">{dino.question.prompt}</p>
          <div className="quiz-options">
            {dino.question.options.map((option, i) => (
              <button
                key={option}
                className={
                  answer === i ? (correct ? "correct" : "incorrect") : ""
                }
                disabled={answer !== null}
                onClick={() => setAnswer(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
                {answer === i && correct ? <Check size={16} /> : null}
              </button>
            ))}
          </div>
          {answer !== null ? (
            <div
              className={`quiz-feedback ${correct ? "correct" : ""}`}
              role="status"
            >
              <p>
                {correct
                  ? dino.question.explanation
                  : "再观察一下知识卡片，你会找到答案。"}
              </p>
              <button onClick={() => setAnswer(null)}>
                {correct ? "再玩一次" : "再试一次"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function InfoPanel(props: Props) {
  const { dino, mode } = props;
  if (props.customName)
    return (
      <aside className="info-panel">
        <h2>你的模型</h2>
        <p className="description">{props.customName}</p>
        <p>
          模型仅在当前浏览器中预览，不会上传。已自动适配展示尺寸，真实比例尚未校准。
        </p>
        <div className="info-divider" />
        <p className="small-note">
          支持旋转与缩放。内置恐龙的知识标记和动作不适用于这个导入模型。
        </p>
        <button className="primary-button" onClick={props.onClearImport}>
          返回馆藏模型
          <ArrowRight size={20} />
        </button>
      </aside>
    );
  if (mode === "compare") {
    const selected = DINOSAURS.filter((d) => props.comparisons.includes(d.id));
    return (
      <aside className="info-panel">
        <h2>同一把尺</h2>
        <p className="description">
          把史前居民放在同一片地面上，感受它们与人的体型差异。
        </p>
        <div className="comparison-list">
          {selected.map((d) => (
            <div className="comparison-item" key={d.id}>
              <div>
                <strong>{d.name}</strong>
                <span>
                  约 <b>{d.length}</b> m
                </span>
              </div>
              <div className="length-track">
                <span
                  style={{
                    width: `${(d.length / 22) * 100}%`,
                    backgroundColor: d.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="comparison-callout">
          <strong>
            {selected.length > 1
              ? `${Math.max(...selected.map((d) => d.length)) / Math.min(...selected.map((d) => d.length)) < 2 ? "体型接近，也各有不同。" : "一眼看见，体型的差距。"}`
              : "加一位居民，一起比较。"}
          </strong>
          <p>点击左侧目录可添加或移除恐龙。</p>
        </div>
        <div className="info-divider" />
        <p className="small-note">
          长度取自资料中的代表性估计，并非所有个体都一样大。模型按头尾水平跨度校准；身体高度和姿态为示意。
        </p>
        <a
          className="source-link"
          href="https://www.nhm.ac.uk/discover/dino-directory"
          target="_blank"
          rel="noreferrer"
        >
          尺寸资料：自然历史博物馆
          <ExternalLink size={13} />
        </a>
      </aside>
    );
  }
  if (mode === "explore") {
    const active = dino.hotspots.find((h) => h.id === props.selectedHotspot);
    return (
      <aside className="info-panel explore-panel">
        <h2>发现身体的秘密</h2>
        <p className="description">点击模型上的标记，或者选择下面的部位。</p>
        <div className="discovery-progress">
          <span>探索进度</span>
          <strong>
            {props.visited.length} <span>/ 3</span>
          </strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${(props.visited.length / 3) * 100}%` }} />
        </div>
        <div className="hotspot-list">
          {dino.hotspots.map((h, i) => (
            <button
              key={h.id}
              onClick={() => props.onHotspot(h.id)}
              className={active?.id === h.id ? "active" : ""}
              aria-pressed={active?.id === h.id}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {h.title}
              {props.visited.includes(h.id) ? (
                <Check size={16} />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
          ))}
        </div>
        <article className="knowledge-detail">
          <h3>{active?.title ?? "从一个标记开始"}</h3>
          <p>
            {active?.text ??
              "角、牙齿、颈部与四肢，每一个部位都藏着线索。旋转模型，试着找到你最感兴趣的地方。"}
          </p>
        </article>
        <Quiz dino={dino} key={dino.id} />
        <a
          className="source-link"
          href={dino.source}
          target="_blank"
          rel="noreferrer"
        >
          阅读原始资料
          <ExternalLink size={13} />
        </a>
      </aside>
    );
  }
  return (
    <aside className="info-panel">
      <h2>认识{dino.name}</h2>
      <p className="description">{dino.description}</p>
      <dl className="facts">
        <div>
          <dt>体长</dt>
          <dd>
            约 <b>{dino.length}</b> m
          </dd>
        </div>
        <div>
          <dt>生存时期</dt>
          <dd>{dino.period}</dd>
        </div>
        <div>
          <dt>食性</dt>
          <dd>{dino.diet}</dd>
        </div>
        <div>
          <dt>发现地</dt>
          <dd>{dino.region}</dd>
        </div>
      </dl>
      <button className="primary-button" onClick={props.onExplore}>
        开始科普探索
        <ArrowRight size={21} />
      </button>
      <a
        className="source-link"
        href={dino.source}
        target="_blank"
        rel="noreferrer"
      >
        资料来源：自然历史博物馆
        <ExternalLink size={13} />
      </a>
      <p className="small-note">
        {dino.age}
        <br />
        尺寸为代表性估计，外观与动作为示意。
      </p>
    </aside>
  );
}
