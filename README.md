# PALEO · 史前档案

三个可交互的恐龙科普展示 Demo，使用 React、TypeScript、Vite 和 Three.js。

## 启动

```powershell
cd E:\my-projects\dinosaur\paleo-demo
npm install
npm run dev
```

打开命令输出的本地地址。`npm run build` 进行类型检查并构建；`npm run preview` 预览构建结果。

## 三个 Demo

- `/?demo=museum`：三角龙、霸王龙、腕龙；拖动旋转、缩放、正面/侧面/重置视角、自动旋转和简化动作。
- `/?demo=explore`：跟随三维模型的身体标记、独立文字入口、知识卡片、探索进度与小测验。
- `/?demo=compare`：选择一到三种恐龙，用同一单位与正交相机比较，附 1.7 米人物参照。

点击展示区的“图例参考”查看三种恐龙的写实视觉方向、原始资料链接和形体说明。图例是内置 ImageGen 新生成的二维艺术复原参考，能旋转的三维模型仍为原创示意模型。

可加 `&species=triceratops`、`tyrannosaurus` 或 `brachiosaurus` 指定默认物种。

## 导入 Tripo / Blender 模型

在模型展馆点“导入 GLB”，选择含嵌入贴图的 `.glb` 文件（最大 50 MB）。模型只在本地浏览器解析，不上传。导入后自动适配展示大小，真实尺寸尚未校准。暂不播放外部模型的动画；示意动作与知识标记仅适用于内置馆藏。

如果 GLB 使用 Draco、Meshopt 或 KTX2 压缩，请先在 Blender/导出工具中生成不依赖外部解码器的普通 GLB。当前导入器不包含这些额外解码器，无法解析时会回到馆藏并显示提示。

## 模型、资料与授权

`src/three/models.ts` 使用原创参数化几何与程序化纹理生成三种恐龙。没有使用外部模型、插画、音效或影视角色。模型属于视觉和交互示意，外观、姿态与动作尚未经过古生物学专业审核。

`src/data/dinosaurs.ts` 将科普内容、尺寸和原始资料链接独立管理。资料参考英国自然历史博物馆 Dino Directory，以自己的语言整理。体长采用三角龙 9 米、霸王龙 12 米、腕龙 22 米的代表性估计；不同个体的尺寸可能不同。模型按头尾水平跨度校准，高度为示意。

界面使用系统字体。Three.js、React 和 lucide 等第三方依赖应保留其对应许可证。将来使用外部素材时，请记录参考图与模型的许可、购买凭证和生成时的套餐及条款。

## 结构

- `src/components/`：目录、模型画布、控制、知识面板、说明弹窗。
- `src/three/ViewerEngine.ts`：相机、光照、渲染、GLB 导入和资源释放。
- `src/three/models.ts`：原创示意模型。
- `src/data/dinosaurs.ts`：物种、科普资料和测验数据。
- `design/concept.png`：内置 ImageGen 生成的主屏视觉参考。
- `DESIGN.md`：视觉约定与有意差异。
- `REFERENCES.md`：参考来源、授权说明和排除的素材。
- `public/references/`：三张写实艺术复原方向图。

模型导入不会保存。探索进度仅保留在当前页面会话中。没有账号、支付或 Tripo 在线生成接口。
