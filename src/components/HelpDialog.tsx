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
      <p className="dialog-intro">14 份史前档案，从观察到发现。</p>
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
            最多添加 6 种标本，用 1.7 米人物和 4.5
            米汽车参照感受尺寸。拖动平移、缩放查看，或保存带模型署名的对比图。
          </p>
        </li>
        <li>
          <strong>年代与地图</strong>
          <p>
            查看生存年代与现代化石发现地区，选择时间条或地图区域进入物种档案。
          </p>
        </li>
        <li>
          <strong>收藏与探索手记</strong>
          <p>
            按名字搜索，按年代、食性或类别筛选。收藏、阅读发现和答题进度会保存在当前浏览器；清除浏览器数据后会重置。
          </p>
        </li>
      </ol>
      <div className="dialog-note">
        <strong>关于模型与资料</strong>
        <p>
          馆藏使用作者公开提供的 CC BY
          模型，作者和许可见“模型来源”。模型为艺术复原，尚未经过古生物学专业审核。森林环境光来自
          Poly Haven 的 CC0
          资源，不代表对特定古环境的科学复原。当前馆藏采用静态标本，支持旋转与缩放。科普档案区分化石证据与艺术创作；海生爬行动物独立标注。
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
