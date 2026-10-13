import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CircleHelp, Images, Upload, X, Map, Download } from "lucide-react";
import { DEMOS, DINOSAURS, getDinosaur } from "./data/dinosaurs";
import type { DemoMode, SpeciesId, ViewPreset } from "./data/dinosaurs";
import CollectionRail from "./components/CollectionRail";
import InfoPanel from "./components/InfoPanel";
import ViewerControls from "./components/ViewerControls";
import HelpDialog from "./components/HelpDialog";
import ReferenceDialog from "./components/ReferenceDialog";
import { SPECIES_PROFILES } from "./data/speciesProfiles";
import {
  recordViewed,
  recordHotspot,
  useLearningProgress,
} from "./data/learningStore";
import type { ViewerHandle } from "./components/SceneViewer";
import "./enhancements.css";

const SceneViewer = lazy(() => import("./components/SceneViewer"));
const SpeciesAtlas = lazy(() => import("./components/SpeciesAtlas"));
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
    [vehicle, setVehicle] = useState(false),
    [naturalLight, setNaturalLight] = useState(true),
    [autoRotate, setAutoRotate] = useState(false),
    [animate, setAnimate] = useState(false);
  const [view, setView] = useState<{ preset: ViewPreset; revision: number }>({
    preset: "reset",
    revision: 0,
  });
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const progress = useLearningProgress();
  const [file, setFile] = useState<File | null>(null),
    [importState, setImportState] = useState<"loading" | "ready" | null>(null);
  const [message, setMessage] = useState(""),
    [help, setHelp] = useState(false),
    [reference, setReference] = useState(false),
    [atlas, setAtlas] = useState(false),
    [exporting, setExporting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<ViewerHandle>(null);
  const dino = getDinosaur(species);
  const marine = SPECIES_PROFILES[species]?.group === "海生爬行动物";
  useEffect(() => {
    if (mode !== "compare" && !file) recordViewed(species);
  }, [species, mode, file]);
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
      if (!comparisons.includes(id) && comparisons.length >= 6) {
        setMessage("一次最多比较 6 种标本。先取消一种，再选择新的居民。");
        return;
      }
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
    setAnimate(false);
    setSelectedHotspot(null);
    setFile(null);
    setImportState(null);
    updateURL(mode, id);
  };
  const selectHotspot = (id: string) => {
    setSelectedHotspot(id);
    recordHotspot(species, id);
  };
  const openAtlasSpecies = (id: SpeciesId) => {
    setSpecies(id);
    setMode("museum");
    setAtlas(false);
    setFile(null);
    setImportState(null);
    setSelectedHotspot(null);
    setAnimate(false);
    updateURL("museum", id);
  };
  const exportComparison = async () => {
    setExporting(true);
    try {
      await viewerRef.current?.saveComparison();
    } catch {
      setMessage("请等待模型加载完成后，再导出对比图。");
    } finally {
      setExporting(false);
    }
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
            className="atlas-launch"
            aria-label="打开年代与地图"
            onClick={() => setAtlas(true)}
          >
            <Map size={18} />
            <span>年代与地图</span>
          </button>
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
        <section
          className={`viewer ${naturalLight && !marine && mode !== "compare" ? "forested" : ""}`}
          aria-labelledby="viewer-title"
        >
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
                <small> / {String(DINOSAURS.length).padStart(2, "0")}</small>
              </span>
              <button
                className="reference-button"
                onClick={() => setReference(true)}
              >
                <Images size={15} />
                模型来源
              </button>
            </div>
          </div>
          {mode !== "compare" && !marine ? (
            <div className="habitat-controls" aria-label="展示环境">
              <button
                className={naturalLight ? "active" : ""}
                aria-pressed={naturalLight}
                onClick={() => setNaturalLight(true)}
              >
                林间光影
              </button>
              <button
                className={!naturalLight ? "active" : ""}
                aria-pressed={!naturalLight}
                onClick={() => setNaturalLight(false)}
              >
                纯净展馆
              </button>
            </div>
          ) : null}
          {mode !== "compare" && marine ? (
            <p className="marine-badge">海生爬行动物 · 非恐龙 · 标本展示</p>
          ) : null}
          {mode === "compare" ? (
            <div className="compare-presets" aria-label="快速比较">
              <button
                onClick={() =>
                  setComparisons([
                    "tyrannosaurus",
                    "spinosaurus",
                    "carcharodontosaurus",
                  ])
                }
              >
                巨型掠食者
              </button>
              <button
                onClick={() =>
                  setComparisons(
                    DINOSAURS.filter((d) => d.diet.startsWith("植食"))
                      .slice(0, 3)
                      .map((d) => d.id),
                  )
                }
              >
                植食居民
              </button>
              <button
                onClick={() => {
                  const sorted = [...DINOSAURS].sort(
                    (a, b) => a.length - b.length,
                  );
                  setComparisons([sorted[0].id, sorted.at(-1)!.id]);
                }}
              >
                最大与最小
              </button>
              <button onClick={exportComparison} disabled={exporting}>
                <Download size={14} />
                {exporting ? "正在导出…" : "保存对比图"}
              </button>
            </div>
          ) : null}
          <Suspense
            fallback={
              <div className="scene-loading">
                <span />
                正在布置展馆…
              </div>
            }
          >
            <SceneViewer
              ref={viewerRef}
              naturalLight={naturalLight && !marine}
              species={species}
              mode={mode}
              comparisons={comparisons}
              human={human}
              vehicle={vehicle}
              autoRotate={autoRotate}
              animate={animate && !file}
              file={file}
              selectedHotspot={selectedHotspot}
              view={view}
              visited={progress.hotspots[species] ?? []}
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
            hasAnimation={dino.asset.animated && !file}
            autoRotate={autoRotate}
            animate={animate && !file}
            human={human}
            vehicle={vehicle}
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
            onVehicle={() => setVehicle((v) => !v)}
          />
        </section>
        <InfoPanel
          dino={dino}
          mode={mode}
          comparisons={comparisons}
          selectedHotspot={selectedHotspot}
          visited={progress.hotspots[species] ?? []}
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
      {atlas ? (
        <Suspense
          fallback={
            <div className="toast" role="status">
              正在打开年代与地图…
            </div>
          }
        >
          <SpeciesAtlas
            onSelect={openAtlasSpecies}
            onClose={() => setAtlas(false)}
          />
        </Suspense>
      ) : null}
      {reference ? (
        <ReferenceDialog
          initialSpecies={species}
          onClose={() => setReference(false)}
        />
      ) : null}
    </div>
  );
}
