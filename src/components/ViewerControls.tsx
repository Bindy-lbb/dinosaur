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
  hasAnimation: boolean;
  autoRotate: boolean;
  animate: boolean;
  human: boolean;
  vehicle: boolean;
  onView: (view: ViewPreset) => void;
  onRotate: () => void;
  onAnimate: () => void;
  onHuman: () => void;
  onVehicle: () => void;
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
          <>
            <Toggle
              checked={props.human}
              label="人物 1.7 m"
              onChange={props.onHuman}
            />
            <Toggle
              checked={props.vehicle}
              label="汽车 4.5 m"
              onChange={props.onVehicle}
            />
          </>
        ) : (
          <>
            <Toggle
              checked={props.autoRotate}
              label="自动旋转"
              onChange={props.onRotate}
            />
            {props.hasAnimation ? (
              <Toggle
                checked={props.animate}
                label="播放动作"
                onChange={props.onAnimate}
              />
            ) : (
              <span className="static-specimen">静态标本</span>
            )}
          </>
        )}
      </div>
      <p className="viewer-hint">
        {props.mode === "compare"
          ? "相同比例 · 拖动平移 · 滚轮或双指缩放"
          : "拖动旋转 · 滚轮或双指缩放"}
      </p>
    </div>
  );
}
