import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ViewerEngine } from "../three/ViewerEngine";
import { DINOSAURS, getDinosaur } from "../data/dinosaurs";
import type { DemoMode, SpeciesId, ViewPreset } from "../data/dinosaurs";
import { RefreshCw } from "lucide-react";

interface Props {
  naturalLight: boolean;
  species: SpeciesId;
  mode: DemoMode;
  comparisons: SpeciesId[];
  human: boolean;
  vehicle: boolean;
  autoRotate: boolean;
  animate: boolean;
  file: File | null;
  selectedHotspot: string | null;
  view: { preset: ViewPreset; revision: number };
  visited: string[];
  onHotspot: (id: string) => void;
  onImport: (state: "loading" | "ready" | "error", message?: string) => void;
}

export interface ViewerHandle {
  saveComparison: () => Promise<void>;
}

export default forwardRef<ViewerHandle, Props>(
  function SceneViewer(props, ref) {
    const canvas = useRef<HTMLCanvasElement>(null),
      engine = useRef<ViewerEngine | null>(null);
    const labels = useRef(new Map<string, HTMLElement>());
    const importCallback = useRef(props.onImport);
    importCallback.current = props.onImport;
    const [error, setError] = useState(false);
    const [assetState, setAssetState] = useState<"loading" | "ready" | "error">(
      "loading",
    );
    useImperativeHandle(
      ref,
      () => ({
        async saveComparison() {
          const data = engine.current?.captureComparison();
          if (!data || !canvas.current) throw new Error("Viewer not ready");
          const picture = new Image();
          picture.src = data.url;
          await picture.decode();
          await document.fonts.ready;
          const chosen = DINOSAURS.filter((d) =>
            props.comparisons.includes(d.id),
          );
          const output = document.createElement("canvas");
          output.width = 1600;
          const modelHeight = 600;
          output.height = 130 + modelHeight + 150 + chosen.length * 64;
          const ctx = output.getContext("2d")!;
          ctx.fillStyle = "#f4f2e9";
          ctx.fillRect(0, 0, output.width, output.height);
          ctx.fillStyle = "#173e32";
          ctx.font = "bold 40px sans-serif";
          ctx.fillText("PALEO 史前档案 · 体型比较", 50, 68);
          ctx.font = "22px sans-serif";
          ctx.fillText(
            `同一比例 · ${props.human ? "人物 1.7 m　" : ""}${props.vehicle ? "汽车 4.5 m" : ""}`,
            50,
            108,
          );
          ctx.drawImage(picture, 0, 130, 1600, modelHeight);
          for (const point of data.points) {
            const d = chosen.find((dino) => dino.id === point.id);
            if (!d) continue;
            ctx.textAlign = "center";
            ctx.fillStyle = "#173e32";
            ctx.font = "bold 24px sans-serif";
            ctx.fillText(d.name, point.x, 130 + point.y - 45);
            ctx.font = "20px sans-serif";
            ctx.fillText(`约 ${d.length} m`, point.x, 130 + point.y - 18);
          }
          ctx.textAlign = "left";
          let y = modelHeight + 180;
          ctx.fillStyle = "#173e32";
          ctx.font = "21px sans-serif";
          ctx.fillText(
            "体长为代表性估计；按模型头尾水平跨度校准。艺术复原，非精确骨骼测量。",
            50,
            y,
          );
          y += 36;
          ctx.fillText(
            "模型许可：CC BY 4.0 · https://creativecommons.org/licenses/by/4.0/",
            50,
            y,
          );
          for (const d of chosen) {
            y += 44;
            ctx.font = "20px sans-serif";
            ctx.fillText(
              `${d.name}  约 ${d.length} m　·　${d.asset.title}　·　${d.asset.author}`,
              50,
              y,
            );
            y += 20;
            ctx.font = "15px sans-serif";
            ctx.fillText(d.asset.url, 50, y);
          }
          ctx.font = "17px sans-serif";
          ctx.fillText(
            "展示副本已调整材质、朝向、比例，部分简化网格并压缩贴图；详情见应用“模型来源”。",
            50,
            y + 36,
          );
          const blob = await new Promise<Blob>((resolve, reject) =>
            output.toBlob(
              (v) => (v ? resolve(v) : reject(new Error("Export failed"))),
              "image/png",
            ),
          );
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "PALEO-体型比较.png";
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        },
      }),
      [props.comparisons, props.human, props.vehicle],
    );
    useEffect(() => {
      try {
        const instance = new ViewerEngine(
          canvas.current!,
          (points) => {
            for (const p of points) {
              const label = labels.current.get(p.id);
              if (label) {
                const comparisonLabel = label.classList.contains("scale-label");
                label.style.transform = comparisonLabel
                  ? `translate(${p.x}px, ${p.y - 8}px) translate(-50%, -100%)`
                  : `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
                label.style.visibility = p.visible ? "visible" : "hidden";
              }
            }
          },
          (state, message) => importCallback.current(state, message),
          setAssetState,
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
      engine.current?.setNaturalLight(props.naturalLight);
    }, [props.naturalLight]);
    useEffect(() => {
      void engine.current?.setContent({
        species: props.species,
        mode: props.mode,
        comparisons: props.comparisons,
        human: props.human,
        vehicle: props.vehicle,
        file: props.file,
      });
    }, [
      props.species,
      props.mode,
      props.comparisons,
      props.human,
      props.vehicle,
      props.file,
    ]);
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
      if (element) {
        labels.current.set(id, element);
        engine.current?.refreshLabels();
      } else labels.current.delete(id);
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
        {assetState === "loading" && !error ? (
          <div className="asset-loading" role="status">
            <span />
            正在加载模型与皮肤贴图…
          </div>
        ) : null}
        {error || assetState === "error" ? (
          <div className="scene-error">
            <strong>暂时无法显示 3D 模型</strong>
            <p>
              {error
                ? "请使用支持 WebGL 的浏览器，并开启硬件加速。"
                : "模型文件未能加载，请重新加载后再试。"}
            </p>
            <button onClick={() => window.location.reload()}>
              <RefreshCw size={16} /> 重新加载
            </button>
          </div>
        ) : null}
        {props.mode === "explore" && assetState === "ready"
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
            {props.vehicle ? (
              <div
                ref={register("vehicle")}
                className="scale-label human-label"
                style={{ visibility: "hidden" }}
              >
                <strong>汽车参照</strong>
                <span>4.5 m</span>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    );
  },
);
