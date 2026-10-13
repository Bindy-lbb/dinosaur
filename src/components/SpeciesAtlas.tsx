import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Globe2, MapPin, X } from "lucide-react";
import { DINOSAURS } from "../data/dinosaurs";
import type { SpeciesId } from "../data/dinosaurs";
import { SPECIES_PROFILES } from "../data/speciesProfiles";
import "../atlas.css";

const project = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * 720,
  y: ((90 - lat) / 180) * 360,
});
// Coarse original coastlines in [longitude, latitude], using exactly the same
// equirectangular projection as the discovery markers.
const coastlineCoordinates = [
  [
    [-168, 72],
    [-140, 70],
    [-125, 72],
    [-112, 74],
    [-90, 73],
    [-76, 68],
    [-60, 55],
    [-53, 48],
    [-65, 45],
    [-73, 42],
    [-80, 26],
    [-82, 25],
    [-84, 30],
    [-89, 29],
    [-97, 26],
    [-97, 20],
    [-88, 18],
    [-86, 15],
    [-83, 9],
    [-78, 8],
    [-78, 9],
    [-85, 17],
    [-90, 21],
    [-97, 22],
    [-105, 20],
    [-110, 24],
    [-115, 29],
    [-117, 33],
    [-122, 38],
    [-125, 48],
    [-130, 54],
    [-140, 59],
    [-152, 59],
    [-165, 61],
    [-168, 66],
  ],
  [
    [-52, 60],
    [-42, 61],
    [-22, 71],
    [-20, 80],
    [-42, 84],
    [-60, 81],
    [-72, 75],
    [-62, 66],
  ],
  [
    [-81, 12],
    [-72, 11],
    [-61, 10],
    [-51, 4],
    [-35, -7],
    [-40, -23],
    [-50, -30],
    [-55, -37],
    [-66, -55],
    [-72, -50],
    [-75, -35],
    [-80, -5],
  ],
  [
    [-17, 14],
    [-17, 21],
    [-13, 28],
    [-10, 31],
    [-6, 35],
    [0, 36],
    [10, 37],
    [20, 33],
    [25, 32],
    [32, 31],
    [35, 23],
    [43, 12],
    [51, 12],
    [43, 0],
    [40, -15],
    [35, -25],
    [20, -35],
    [15, -30],
    [12, -17],
    [10, -1],
    [0, 5],
    [-10, 5],
  ],
  [
    [-10, 36],
    [-9, 43],
    [-1, 48],
    [4, 51],
    [8, 55],
    [5, 59],
    [18, 71],
    [30, 70],
    [37, 65],
    [50, 70],
    [75, 73],
    [105, 77],
    [140, 72],
    [180, 67],
    [180, 62],
    [155, 58],
    [143, 48],
    [138, 36],
    [128, 32],
    [122, 24],
    [110, 20],
    [106, 9],
    [104, 2],
    [99, 6],
    [100, 15],
    [96, 20],
    [88, 21],
    [82, 8],
    [77, 8],
    [70, 21],
    [61, 25],
    [57, 17],
    [50, 12],
    [43, 13],
    [35, 30],
    [29, 36],
    [24, 40],
    [20, 39],
    [14, 38],
    [12, 42],
    [8, 44],
    [3, 42],
    [3, 38],
    [-5, 36],
  ],
  [
    [-8, 50],
    [-5, 59],
    [0, 58],
    [1, 52],
  ],
  [
    [130, 31],
    [133, 34],
    [139, 36],
    [145, 44],
    [143, 45],
    [137, 38],
  ],
  [
    [95, 5],
    [105, -6],
    [114, -8],
    [120, -8],
    [108, -2],
  ],
  [
    [130, -3],
    [141, -2],
    [151, -6],
    [147, -10],
    [137, -8],
  ],
  [
    [113, -22],
    [114, -34],
    [131, -32],
    [138, -38],
    [146, -43],
    [153, -28],
    [147, -19],
    [142, -11],
    [136, -12],
    [129, -15],
    [122, -18],
  ],
  [
    [173, -35],
    [178, -39],
    [174, -42],
    [169, -46],
    [166, -46],
    [172, -40],
  ],
  [
    [48, -13],
    [50, -17],
    [46, -26],
    [43, -24],
  ],
];
const continents = coastlineCoordinates.map(
  (outline) =>
    `${outline
      .map(([lon, lat], index) => {
        const point = project(lat, lon);
        return `${index ? "L" : "M"}${point.x} ${point.y}`;
      })
      .join(" ")}Z`,
);

export default function SpeciesAtlas({
  onSelect,
  onClose,
}: {
  onSelect: (id: SpeciesId) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const available = useMemo(
    () => DINOSAURS.filter((d) => SPECIES_PROFILES[d.id]),
    [],
  );
  const [selected, setSelected] = useState<SpeciesId>(available[0].id);
  const [region, setRegion] = useState<string | null>(null);
  const [mapGroup, setMapGroup] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const dino = available.find((d) => d.id === selected)!;
  const profile = SPECIES_PROFILES[selected];
  const oldest = expanded
    ? 252
    : Math.ceil(
        Math.max(...available.map((d) => SPECIES_PROFILES[d.id].startMa)) / 10,
      ) * 10;
  const youngest = 66;
  const position = (ma: number) => ((oldest - ma) / (oldest - youngest)) * 100;
  const ticks = expanded
    ? [252, 201, 145, 100, 66]
    : [
        oldest,
        ...[150, 125, 100, 80].filter((v) => v < oldest && v > youngest),
        66,
      ];
  const regions = useMemo(() => {
    const values = new Map<
      string,
      { name: string; lat: number; lon: number; ids: SpeciesId[] }
    >();
    available.forEach((d) =>
      SPECIES_PROFILES[d.id].locations.forEach((loc) => {
        const existing = values.get(loc.name);
        if (existing) existing.ids.push(d.id);
        else values.set(loc.name, { ...loc, ids: [d.id] });
      }),
    );
    return [...values.values()];
  }, [available]);
  const mapGroups = useMemo(() => {
    const groups = new Map<
      string,
      { name: string; locations: typeof regions; ids: SpeciesId[] }
    >();
    regions.forEach((loc) => {
      // Group nearby discovery areas instead of stacking inaccessible pins.
      const key =
        loc.lon < -30
          ? loc.lat > 0
            ? "北美洲"
            : "南美洲"
          : loc.lon < 55
            ? "北非"
            : "蒙古";
      const group = groups.get(key) ?? { name: key, locations: [], ids: [] };
      group.locations.push(loc);
      group.ids = [...new Set([...group.ids, ...loc.ids])];
      groups.set(key, group);
    });
    return [...groups.values()].map((group) => ({
      ...group,
      lat:
        group.locations.reduce((sum, loc) => sum + loc.lat, 0) /
        group.locations.length,
      lon:
        group.locations.reduce((sum, loc) => sum + loc.lon, 0) /
        group.locations.length,
    }));
  }, [regions]);
  const regionMembers = region
    ? (regions.find((r) => r.name === region)?.ids ?? [])
    : (mapGroups.find((g) => g.name === mapGroup)?.ids ?? []);
  const regionLabel =
    region ?? (mapGroup ? `${mapGroup} · 多处发现地区` : null);

  useEffect(() => {
    const node = dialog.current!;
    node.showModal();
    return () => node.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      className="atlas-dialog"
      aria-labelledby="atlas-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header className="atlas-header">
        <div>
          <span className="atlas-eyebrow">DEEP TIME · DISCOVERY</span>
          <h2 id="atlas-title">走进它们的时空</h2>
          <p>在时间与地图上，重新认识馆藏里的远古生命。</p>
        </div>
        <button
          className="atlas-close"
          onClick={onClose}
          aria-label="关闭年代与地图"
          autoFocus
        >
          <X size={22} />
        </button>
      </header>
      <div className="atlas-layout">
        <section className="atlas-visuals" aria-label="年代轴与化石地图">
          <div className="atlas-section-heading">
            <h3>它们生活在什么时候？</h3>
            <button
              className="atlas-toggle"
              onClick={() => setExpanded(!expanded)}
              aria-pressed={expanded}
            >
              {expanded ? "聚焦馆藏年代" : "查看整个中生代"}
            </button>
          </div>
          <p className="atlas-caption">
            单位：百万年前（Ma）· 左边更古老，右边更接近今天
          </p>
          <div className="atlas-timeline">
            <div className="atlas-axis">
              <span />{" "}
              <div>
                {ticks.map((tick) => (
                  <span key={tick} style={{ left: `${position(tick)}%` }}>
                    {tick}
                  </span>
                ))}
              </div>
            </div>
            <div className="atlas-periods">
              <span />{" "}
              <div>
                {[
                  { name: "三叠纪", from: 252, to: 201 },
                  { name: "侏罗纪", from: 201, to: 145 },
                  { name: "白垩纪", from: 145, to: 66 },
                ]
                  .filter((p) => p.to < oldest)
                  .map((p) => (
                    <span
                      key={p.name}
                      style={{
                        left: `${position(Math.min(oldest, p.from))}%`,
                        width: `${((Math.min(oldest, p.from) - Math.max(youngest, p.to)) / (oldest - youngest)) * 100}%`,
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
              </div>
            </div>
            {available.map((item) => {
              const data = SPECIES_PROFILES[item.id];
              return (
                <button
                  className={`atlas-time-row ${selected === item.id ? "selected" : ""}`}
                  key={item.id}
                  aria-pressed={selected === item.id}
                  onClick={() => {
                    setSelected(item.id);
                    setRegion(null);
                    setMapGroup(null);
                  }}
                  aria-label={`${item.name}，约${data.startMa === data.endMa ? data.startMa : `${data.startMa}至${data.endMa}`}百万年前`}
                >
                  <span>{item.name}</span>
                  <span className="atlas-track">
                    <i
                      style={{
                        left: `${position(data.startMa)}%`,
                        width: `${Math.max(((data.startMa - data.endMa) / (oldest - youngest)) * 100, 0.6)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="atlas-caption atlas-range-note">
            色条表示近似年代；单点表示约略年代。不是所有恐龙都生活在侏罗纪，年代重叠也不一定相遇。
          </p>
          <div className="atlas-section-heading">
            <h3>
              <Globe2 size={17} /> 化石在哪里被发现？
            </h3>
          </div>
          <div className="atlas-world-map">
            <svg
              viewBox="0 0 720 360"
              role="img"
              aria-label="现代大陆轮廓示意图；互动发现地按钮位于图上"
            >
              <rect width="720" height="360" rx="14" fill="#e6ede7" />
              {[90, 180, 270].map((y) => (
                <line
                  key={`y${y}`}
                  x1="0"
                  x2="720"
                  y1={y}
                  y2={y}
                  stroke="#d1dcd3"
                  strokeDasharray="3 5"
                />
              ))}
              {[120, 240, 360, 480, 600].map((x) => (
                <line
                  key={`x${x}`}
                  x1={x}
                  x2={x}
                  y1="0"
                  y2="360"
                  stroke="#d1dcd3"
                  strokeDasharray="3 5"
                />
              ))}
              {continents.map((path, i) => (
                <path
                  key={i}
                  d={path}
                  fill="#b7c8b9"
                  stroke="#90aa96"
                  strokeWidth="1"
                />
              ))}
              {regions.map((loc) => {
                const point = project(loc.lat, loc.lon);
                return (
                  <circle
                    key={loc.name}
                    cx={point.x}
                    cy={point.y}
                    r="2.5"
                    fill="#496e51"
                  >
                    <title>{loc.name}</title>
                  </circle>
                );
              })}
              <text x="70" y="340" fill="#657d6b" fontSize="13">
                现代地理位置 · 大陆轮廓示意
              </text>
            </svg>
            {mapGroups.map((loc) => {
              const point = project(loc.lat, loc.lon);
              const isSelected = loc.ids.includes(selected);
              return (
                <button
                  key={loc.name}
                  className={`atlas-map-pin ${isSelected ? "selected" : ""}`}
                  style={{
                    left: `${(point.x / 720) * 100}%`,
                    top: `${(point.y / 360) * 100}%`,
                  }}
                  title={`${loc.name} · ${loc.locations.map((l) => l.name).join("、")}`}
                  aria-label={`查看${loc.name}的${loc.ids.length}种馆藏`}
                  onClick={() => {
                    setRegion(null);
                    setMapGroup(loc.name);
                    setSelected(loc.ids[0]);
                  }}
                >
                  <span>{loc.ids.length}</span>
                </button>
              );
            })}
          </div>
          <p className="atlas-caption">
            数字图钉合并了相邻地区，表示该区域的馆藏物种数；小点为代表性发现地区。可在下方选择具体地点。这里是现代地理位置，不是古大陆复原图或精确挖掘坐标。
          </p>
          <div className="atlas-region-picker" aria-label="按发现地区浏览">
            <label htmlFor="atlas-region">发现地区</label>
            <select
              id="atlas-region"
              value={region ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setRegion(value || null);
                setMapGroup(null);
                if (value)
                  setSelected(regions.find((r) => r.name === value)!.ids[0]);
              }}
            >
              <option value="">全部地区</option>
              {regions.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name} · {r.ids.length} 种
                </option>
              ))}
            </select>
          </div>
          {regionLabel && (
            <div className="atlas-region-results">
              <strong>
                <MapPin size={14} /> {regionLabel}
              </strong>
              <div>
                {regionMembers.map((id) => (
                  <button
                    key={id}
                    aria-pressed={id === selected}
                    onClick={() => setSelected(id)}
                  >
                    {available.find((d) => d.id === id)!.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
        <aside className="atlas-species" aria-live="polite">
          <span className="atlas-eyebrow">
            {profile.group} / {profile.family}
          </span>
          <h3>{dino.name}</h3>
          <em>{dino.latin}</em>
          <div className="atlas-time-value">
            约{" "}
            {profile.startMa === profile.endMa
              ? profile.startMa
              : `${profile.startMa}–${profile.endMa}`}
            <span>百万年前</span>
          </div>
          <h4>曾经的家园</h4>
          <p>{profile.habitat}</p>
          <h4>发现与命名</h4>
          <p>{profile.discovery}</p>
          <div className="atlas-evidence">
            <strong>从证据出发</strong>
            <p>{profile.evidence}</p>
          </div>
          <div className="atlas-links">
            {profile.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
          <button
            className="atlas-enter"
            onClick={() => {
              onSelect(selected);
              onClose();
            }}
          >
            走近{dino.name} · 查看 3D <ArrowUpRight size={16} />
          </button>
        </aside>
      </div>
    </dialog>
  );
}
