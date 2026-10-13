import { useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import { DINOSAURS } from "../data/dinosaurs";

export default function HelpDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialog.current!;
    d.showModal();
    return () => {
      d.close();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="help-dialog"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="help-title"
    >
      <button
        className="dialog-close"
        onClick={onClose}
        aria-label="关闭说明"
        autoFocus
      >
        <X size={22} />
      </button>
      <h2 id="help-title">开启你的史前探索</h2>
      <p className="dialog-intro">三个小 Demo，三种认识恐龙的方式。</p>
      <ol className="help-steps">
        <li>
          <strong>模型展馆</strong>
          <p>拖动旋转，滚轮或双指缩放。用正面、侧面与重置按钮切换视角。</p>
        </li>
        <li>
          <strong>科普探索</strong>
          <p>点击身体标记阅读知识，完成三个发现，再试试小测验。</p>
        </li>
        <li>
          <strong>体型比较</strong>
          <p>
            从目录添加恐龙，用 1.7 米人物参照感受尺寸。正交视图保持相同比例。
          </p>
        </li>
      </ol>
      <div className="dialog-note">
        <strong>关于模型与资料</strong>
        <p>
          内置恐龙由程序生成，为原创外观与动作示意，尚未经过古生物学专业复原审核。科普信息以自然历史博物馆资料为参考，使用自己的语言整理。
        </p>
        <p>
          可导入不超过 50 MB 的 GLB
          文件。模型仅在本地浏览器解析，不上传；请使用你有权使用的模型。
        </p>
      </div>
      <div className="dialog-sources">
        {DINOSAURS.map((d) => (
          <a key={d.id} href={d.source} target="_blank" rel="noreferrer">
            {d.name}资料
            <ExternalLink size={13} />
          </a>
        ))}
      </div>
    </dialog>
  );
}
