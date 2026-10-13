import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { CircleHelp, Images, Upload, X } from "lucide-react";
import { DEMOS, DINOSAURS, getDinosaur } from "./data/dinosaurs";
import type { DemoMode, SpeciesId, ViewPreset } from "./data/dinosaurs";
import CollectionRail from "./components/CollectionRail";
import InfoPanel from "./components/InfoPanel";
import ViewerControls from "./components/ViewerControls";
import HelpDialog from "./components/HelpDialog";
import ReferenceDialog from "./components/ReferenceDialog";

const SceneViewer = lazy(() => import("./components/SceneViewer"));
const initialParams = new URLSearchParams(window.location.search);
const initialMode =
  DEMOS.find((d) => d.id === initialParams.get("demo"))?.id ?? "museum";
const initialSpecies =
  DINOSAURS.find((d) => d.id === initialParams.get("species"))?.id ??
  "triceratops";

export default function App() {
  const [mode, setMode] = useState<DemoMode>(initialMode),
    [species, setSpecies] = useState<SpeciesId>(initialSpecies);
  const [comparisons, setComparisons] = useState<SpeciesId[]>([
    "triceratops",
    "tyrannosaurus",
  ]);
  const [human, setHuman] = useState(true),
    [autoRotate, setAutoRotate] = useState(false),
    [animate, setAnimate] = useState(false);
  const [view, setView] = useState<{ preset: ViewPreset; revision: number }>({
    preset: "reset",
    revision: 0,
  });
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [visited, setVisited] = useState<Record<SpeciesId, string[]>>({
    triceratops: [],
    tyrannosaurus: [],
    brachiosaurus: [],
  });
  const [file, setFile] = useState<File | null>(null),
    [importState, setImportState] = useState<"loading" | "ready" | null>(null);
  const [message, setMessage] = useState(""),
    [help, setHelp] = useState(false),
    [reference, setReference] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const dino = getDinosaur(species);
  const updateURL = (nextMode: DemoMode, nextSpecies: SpeciesId) => {
    const url = new URL(window.location.href);
    url.searchParams.set("demo", nextMode);
    url.searchParams.set("species", nextSpecies);
    window.history.replaceState(null, "", url);
  };
  const changeMode = (id: DemoMode) => {
    setMode(id);
    setSelectedHotspot(null);
    setFile(null);
    setImportState(null);
    updateURL(id, species);
  };
  const selectSpecies = (id: SpeciesId) => {
    if (mode === "compare") {
      setComparisons((current) =>
        current.includes(id)
          ? current.length === 1
            ? current
            : current.filter((v) => v !== id)
          : [...current, id],
      );
      return;
    }
    setSpecies(id);
    setSelectedHotspot(null);
    setFile(null);
    setImportState(null);
    updateURL(mode, id);
  };
  const selectHotspot = (id: string) => {
    setSelectedHotspot(id);
    setVisited((current) =>
      current[species].includes(id)
        ? current
        : { ...current, [species]: [...current[species], id] },
    );
  };
  const setPreset = (preset: ViewPreset) => {
    setSelectedHotspot(null);
    setView((current) => ({ preset, revision: current.revision + 1 }));
  };
  const importCallback = useCallback(
    (state: "loading" | "ready" | "error", text?: string) => {
      if (state === "error") {
        setMessage(text ?? "读取失败");
        setFile(null);
        setImportState(null);
      } else setImportState(state);
    },
    [],
  );
  const importFile = (chosen: File | undefined) => {
    if (!chosen) return;
    if (!chosen.name.toLowerCase().endsWith(".glb")) {
      setMessage("请选择 .glb 格式的模型。");
      return;
    }
    if (chosen.size > 50 * 1024 * 1024) {
      setMessage("这个模型超过 50 MB，请先优化后再导入。");
      return;
    }
    changeMode("museum");
    setAnimate(false);
    setAutoRotate(false);
    setFile(chosen);
    setImportState("loading");
    setMessage("");
  };
  const customName = file && importState === "ready" ? file.name : null;
  return (
    <div className="app-shell">
      <header className="app-header">
        <a
          className="brand"
          href="/?demo=museum"
          aria-label="PALEO 史前档案首页"
        >
          <span>PALEO</span>
          <b>史前档案</b>
        </a>
        <nav className="top-nav" aria-label="Demo 模式">
          {DEMOS.map((d) => (
            <button
              key={d.id}
              className={mode === d.id ? "active" : ""}
              onClick={() => changeMode(d.id)}
              aria-current={mode === d.id ? "page" : undefined}
            >
              {d.name}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="import-button"
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={19} />
            <span>导入 GLB</span>
          </button>
          <button
            className="help-button"
            aria-label="使用说明与资料来源"
            onClick={() => setHelp(true)}
          >
            <CircleHelp size={26} strokeWidth={1.4} />
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".glb"
          className="visually-hidden"
          aria-label="选择 GLB 模型文件"
          onChange={(event) => {
            importFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </header>
      <main className={`workspace mode-${mode}`}>
        <CollectionRail
          mode={mode}
          species={species}
          comparisons={comparisons}
          onSelect={selectSpecies}
        />
        <section className="viewer" aria-labelledby="viewer-title">
          <div className="viewer-heading">
            <div>
              <h1 id="viewer-title">
                {customName
                  ? "你的模型"
                  : mode === "compare"
                    ? "体型比较"
                    : dino.name}
              </h1>
              <p>
                {customName
                  ? "Your collection"
                  : mode === "compare"
                    ? "A matter of scale"
                    : dino.latin}
              </p>
            </div>
            <div className="viewer-heading-actions">
              <span className="specimen-number">
                {mode === "compare"
                  ? String(comparisons.length).padStart(2, "0")
                  : dino.number}
                <small> / 03</small>
              </span>
              <button
                className="reference-button"
                onClick={() => setReference(true)}
              >
                <Images size={15} />
                图例参考
              </button>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="scene-loading">
                <span />
                正在布置展馆…
              </div>
            }
          >
            <SceneViewer
              species={species}
              mode={mode}
              comparisons={comparisons}
              human={human}
              autoRotate={autoRotate}
              animate={animate && !file}
              file={file}
              selectedHotspot={selectedHotspot}
              view={view}
              visited={visited[species]}
              onHotspot={selectHotspot}
              onImport={importCallback}
            />
          </Suspense>
          {importState === "loading" ? (
            <div className="import-loading" role="status">
              正在读取你的模型…
            </div>
          ) : null}
          <ViewerControls
            mode={mode}
            autoRotate={autoRotate}
            animate={animate && !file}
            human={human}
            onView={setPreset}
            onRotate={() => setAutoRotate((v) => !v)}
            onAnimate={() => {
              if (file) {
                setMessage(
                  "导入模型目前支持静态展示；返回馆藏后可播放示意动作。",
                );
                return;
              }
              setAnimate((v) => !v);
            }}
            onHuman={() => setHuman((v) => !v)}
          />
        </section>
        <InfoPanel
          dino={dino}
          mode={mode}
          comparisons={comparisons}
          selectedHotspot={selectedHotspot}
          visited={visited[species]}
          customName={customName}
          onHotspot={selectHotspot}
          onExplore={() => changeMode("explore")}
          onClearImport={() => {
            setFile(null);
            setImportState(null);
          }}
        />
      </main>
      <footer className="demo-footer" aria-label="体验三个 Demo">
        {DEMOS.map((d) => (
          <button
            key={d.id}
            onClick={() => changeMode(d.id)}
            className={mode === d.id ? "active" : ""}
          >
            <span>{d.number}</span>
            <strong>{d.name}</strong>
            <small>{d.description}</small>
          </button>
        ))}
      </footer>
      {message ? (
        <div className="toast" role="status">
          <span>{message}</span>
          <button onClick={() => setMessage("")} aria-label="关闭提示">
            <X size={17} />
          </button>
        </div>
      ) : null}
      {help ? <HelpDialog onClose={() => setHelp(false)} /> : null}
      {reference ? (
        <ReferenceDialog
          initialSpecies={species}
          onClose={() => setReference(false)}
        />
      ) : null}
    </div>
  );
}
