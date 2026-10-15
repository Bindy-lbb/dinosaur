import { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Square,
  Trees,
  Waves,
  Volume2,
  VolumeX,
  ExternalLink,
} from "lucide-react";
import type { SpeciesId } from "../data/dinosaurs";
import { SOUND_SOURCES, SPECIES_SOUNDS } from "../data/sounds";
import "../sounds.css";

type Channel = "call" | "ambience";
type Phase = "idle" | "loading" | "playing";
const initialVolume = () => {
  try {
    const raw = localStorage.getItem("paleo-audio-volume-v1");
    const value = raw === null ? 45 : Number(raw);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 45;
  } catch {
    return 45;
  }
};

export default function SoundControls({
  species,
  name,
  marine,
}: {
  species: SpeciesId;
  name: string;
  marine: boolean;
}) {
  const audio = useRef<Partial<Record<Channel, HTMLAudioElement>>>({});
  const generation = useRef({ call: 0, ambience: 0 });
  const [phase, setPhase] = useState<Record<Channel, Phase>>({
    call: "idle",
    ambience: "idle",
  });
  const [volume, setVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const sound = SPECIES_SOUNDS[species];
  const ambience = SOUND_SOURCES[marine ? "ocean" : "forest"];

  const stop = (channel: Channel) => {
    generation.current[channel]++;
    const player = audio.current[channel];
    if (player) {
      player.pause();
      if (player.readyState > 0) player.currentTime = 0;
    }
    setPhase((current) => ({ ...current, [channel]: "idle" }));
  };

  useEffect(() => {
    const players = audio.current;
    const versions = generation.current;
    const quiet = () => {
      if (!document.hidden) return;
      for (const channel of ["call", "ambience"] as const) {
        versions[channel]++;
        players[channel]?.pause();
      }
      setPhase({ call: "idle", ambience: "idle" });
    };
    document.addEventListener("visibilitychange", quiet);
    return () => {
      document.removeEventListener("visibilitychange", quiet);
      for (const channel of ["call", "ambience"] as const) {
        versions[channel]++;
        const player = players[channel];
        if (!player) continue;
        player.onended = null;
        player.pause();
        player.removeAttribute("src");
        player.load();
      }
    };
  }, []);

  useEffect(() => {
    for (const channel of ["call", "ambience"] as const) {
      const player = audio.current[channel];
      if (player) {
        player.volume =
          (volume / 100) * (channel === "call" ? sound.gain : 0.35);
        player.muted = muted;
      }
    }
    try {
      localStorage.setItem("paleo-audio-volume-v1", String(volume));
    } catch {
      /* Playback does not require storage. */
    }
  }, [volume, muted, sound.gain]);

  const toggle = async (channel: Channel) => {
    if (phase[channel] !== "idle") {
      stop(channel);
      return;
    }
    setError("");
    const player = audio.current[channel] ?? new Audio();
    audio.current[channel] = player;
    const token = ++generation.current[channel];
    const source = channel === "call" ? SOUND_SOURCES[sound.sample] : ambience;
    player.preload = "none";
    if (!player.src.endsWith(source.file)) player.src = source.file;
    else if (player.error) player.load();
    player.loop = channel === "ambience";
    player.playbackRate = channel === "call" ? sound.rate : 1;
    player.preservesPitch = channel !== "call";
    player.volume = (volume / 100) * (channel === "call" ? sound.gain : 0.35);
    player.muted = muted;
    if (player.readyState > 0) player.currentTime = 0;
    player.onended = () => {
      if (generation.current[channel] === token)
        setPhase((current) => ({ ...current, [channel]: "idle" }));
    };
    setPhase((current) => ({ ...current, [channel]: "loading" }));
    try {
      await player.play();
      if (generation.current[channel] === token)
        setPhase((current) => ({ ...current, [channel]: "playing" }));
    } catch {
      if (generation.current[channel] !== token) return;
      setPhase((current) => ({ ...current, [channel]: "idle" }));
      setError("音效暂时无法播放，请再次点击重试。");
    }
  };

  const callText =
    phase.call === "loading"
      ? "取消加载"
      : phase.call === "playing"
        ? "停止叫声"
        : sound.label;
  const ambienceText =
    phase.ambience === "loading"
      ? "取消加载"
      : marine
        ? "海浪氛围"
        : "林间氛围";
  return (
    <div className="sound-controls" aria-label="声音体验">
      <div className="sound-actions">
        <button
          className={phase.call !== "idle" ? "sound-active" : ""}
          aria-label={
            phase.call === "idle"
              ? `播放${name}${sound.label}`
              : `${callText}：${name}`
          }
          aria-pressed={phase.call !== "idle"}
          onClick={() => void toggle("call")}
          disabled={muted || volume === 0}
        >
          {phase.call === "idle" ? (
            <AudioLines size={16} />
          ) : (
            <Square size={14} />
          )}
          <span>{callText}</span>
        </button>
        <button
          className={phase.ambience !== "idle" ? "sound-active" : ""}
          aria-label={`${phase.ambience === "idle" ? "开启" : "关闭"}${marine ? "海浪" : "林间"}氛围`}
          aria-pressed={phase.ambience !== "idle"}
          onClick={() => void toggle("ambience")}
          disabled={muted || volume === 0}
        >
          {marine ? <Waves size={16} /> : <Trees size={16} />}
          <span>{ambienceText}</span>
        </button>
        <details className="sound-settings">
          <summary aria-label="音量与音效来源">
            {muted || volume === 0 ? (
              <VolumeX size={16} />
            ) : (
              <Volume2 size={16} />
            )}
          </summary>
          <div className="sound-popover">
            <div className="sound-volume-title">
              <label htmlFor="sound-volume">音量 · {volume}%</label>
              <button
                onClick={() => {
                  const next = !muted;
                  setMuted(next);
                  if (next) {
                    stop("call");
                    stop("ambience");
                  }
                }}
                aria-label={muted ? "取消静音" : "全部静音"}
                aria-pressed={muted}
              >
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                {muted ? "已静音" : "静音"}
              </button>
            </div>
            <input
              id="sound-volume"
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={(event) => {
                const next = Number(event.target.value);
                setVolume(next);
                if (next === 0) {
                  stop("call");
                  stop("ambience");
                }
              }}
            />
            <p>
              叫声为艺术演绎，不能作为真实恐龙发声的证据。环境声用于营造氛围。
            </p>
            <div className="sound-credits">
              <strong>音效来源 · CC0</strong>
              {[SOUND_SOURCES[sound.sample], ambience].map((source) => (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  key={source.file}
                >
                  {source.title} · {source.author}
                  <ExternalLink size={12} />
                </a>
              ))}
              <a href={`${import.meta.env.BASE_URL}audio/credits.json`} target="_blank" rel="noreferrer">
                完整音效清单与许可 <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </details>
      </div>
      <p className="sound-caption" aria-live="polite">
        {error ||
          (muted
            ? "已静音 · 在音量设置中开启"
            : volume === 0
              ? "音量为零 · 调高后播放"
              : "声音 · 艺术演绎")}
      </p>
    </div>
  );
}
