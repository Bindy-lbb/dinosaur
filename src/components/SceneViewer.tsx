import { useEffect, useRef, useState } from "react";
import { ViewerEngine } from "../three/ViewerEngine";
import { DINOSAURS, getDinosaur } from "../data/dinosaurs";
import type { DemoMode, SpeciesId, ViewPreset } from "../data/dinosaurs";
import { RefreshCw } from "lucide-react";

interface Props {
  species: SpeciesId;
  mode: DemoMode;
  comparisons: SpeciesId[];
  human: boolean;
  autoRotate: boolean;
  animate: boolean;
  file: File | null;
  selectedHotspot: string | null;
  view: { preset: ViewPreset; revision: number };
  visited: string[];
  onHotspot: (id: string) => void;
  onImport: (state: "loading" | "ready" | "error", message?: string) => void;
}

export default function SceneViewer(props: Props) {
  const canvas = useRef<HTMLCanvasElement>(null),
    engine = useRef<ViewerEngine | null>(null);
  const labels = useRef(new Map<string, HTMLElement>());
  const importCallback = useRef(props.onImport);
  importCallback.current = props.onImport;
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      const instance = new ViewerEngine(
        canvas.current!,
        (points) => {
          for (const p of points) {
            const label = labels.current.get(p.id);
            if (label) {
              label.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
              label.style.visibility = p.visible ? "visible" : "hidden";
            }
          }
        },
        (state, message) => importCallback.current(state, message),
      );
      engine.current = instance;
      return () => {
        instance.dispose();
        engine.current = null;
      };
    } catch {
      setError(true);
    }
  }, []);
  useEffect(() => {
    void engine.current?.setContent({
      species: props.species,
      mode: props.mode,
      comparisons: props.comparisons,
      human: props.human,
      file: props.file,
    });
  }, [props.species, props.mode, props.comparisons, props.human, props.file]);
  useEffect(() => {
    engine.current?.setPlayback(props.autoRotate, props.animate);
  }, [props.autoRotate, props.animate, props.species, props.mode]);
  useEffect(() => {
    engine.current?.setView(props.view.preset);
  }, [props.view]);
  useEffect(() => {
    engine.current?.focusHotspot(props.selectedHotspot);
  }, [props.selectedHotspot]);
  const register = (id: string) => (element: HTMLElement | null) => {
    if (element) labels.current.set(id, element);
    else labels.current.delete(id);
  };
  return (
    <div
      className="scene"
      aria-label={
        props.mode === "compare"
          ? "相同比例恐龙体型比较"
          : `${getDinosaur(props.species).name}三维展示`
      }
    >
      <canvas ref={canvas} aria-label="三维模型，可拖动旋转并缩放" />
      {error ? (
        <div className="scene-error">
          <strong>暂时无法显示 3D 模型</strong>
          <p>请使用支持 WebGL 的浏览器，并开启硬件加速。科普信息仍可阅读。</p>
          <button onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> 重新加载
          </button>
        </div>
      ) : null}
      {props.mode === "explore"
        ? getDinosaur(props.species).hotspots.map((h, i) => (
            <button
              key={h.id}
              ref={register(h.id)}
              className={`hotspot ${props.selectedHotspot === h.id ? "active" : ""} ${props.visited.includes(h.id) ? "visited" : ""}`}
              style={{ visibility: "hidden" }}
              onClick={() => props.onHotspot(h.id)}
              aria-label={`探索${h.title}`}
              aria-pressed={props.selectedHotspot === h.id}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{h.short}</b>
            </button>
          ))
        : null}
      {props.mode === "compare" ? (
        <>
          {DINOSAURS.filter((d) => props.comparisons.includes(d.id)).map(
            (d) => (
              <div
                key={d.id}
                ref={register(d.id)}
                className="scale-label"
                style={{ visibility: "hidden" }}
              >
                <strong>{d.name}</strong>
                <span>约 {d.length} m</span>
              </div>
            ),
          )}
          {props.human ? (
            <div
              ref={register("human")}
              className="scale-label human-label"
              style={{ visibility: "hidden" }}
            >
              <strong>人物参照</strong>
              <span>1.7 m</span>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
