import { RotateCcw, ScanEye, UserRound } from "lucide-react";
import type { DemoMode, ViewPreset } from "../data/dinosaurs";
import DinoIcon from "./DinoIcon";

export function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      className="toggle-control"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
    >
      <span>{label}</span>
      <span className={`toggle-track ${checked ? "on" : ""}`}>
        <span />
      </span>
    </button>
  );
}

interface Props {
  mode: DemoMode;
  autoRotate: boolean;
  animate: boolean;
  human: boolean;
  onView: (view: ViewPreset) => void;
  onRotate: () => void;
  onAnimate: () => void;
  onHuman: () => void;
}
export default function ViewerControls(props: Props) {
  return (
    <div className="viewer-controls">
      <div className="control-row">
        {props.mode !== "compare" ? (
          <>
            <button
              className="pill-control"
              onClick={() => props.onView("front")}
            >
              <ScanEye size={17} />
              正面
            </button>
            <button
              className="pill-control"
              onClick={() => props.onView("side")}
            >
              <DinoIcon species="triceratops" />
              侧面
            </button>
          </>
        ) : (
          <span className="scale-unit">
            <UserRound size={17} />
            同一比例 · 单位：米
          </span>
        )}
        <button className="pill-control" onClick={() => props.onView("reset")}>
          <RotateCcw size={17} />
          重置
        </button>
        <span className="control-divider" />
        {props.mode === "compare" ? (
          <Toggle
            checked={props.human}
            label="人物参照"
            onChange={props.onHuman}
          />
        ) : (
          <>
            <Toggle
              checked={props.autoRotate}
              label="自动旋转"
              onChange={props.onRotate}
            />
            <Toggle
              checked={props.animate}
              label="播放动作"
              onChange={props.onAnimate}
            />
          </>
        )}
      </div>
      <p className="viewer-hint">
        {props.mode === "compare"
          ? "正交视图保持相同比例 · 滚轮缩放"
          : "拖动旋转 · 滚轮或双指缩放"}
      </p>
    </div>
  );
}
