# PALEO · 史前档案

本地恐龙 3D 科普 Demo，React + TypeScript + Three.js + Vite。

## 启动

```powershell
npm install
npm run dev -- --port 5173
```

访问 http://127.0.0.1:5173/ 。`npm run build` 检查 TypeScript 并生成静态文件。

## 当前版本

- 14 个带纹理的 GLB 馆藏条目：13 个恐龙条目，以及海生爬行动物海王龙。
- 模型展馆：鼠标旋转、缩放、正侧面视角，森林环境 / 纯净展馆切换。
- 科普探索：每个馆藏三个知识标记及小测验；物种档案补充发现、生活环境、取食、证据与参考资料。
- 体型比较：最多选择 6 种标本，正交投影保持相同比例；提供 1.7 m 人物与 4.5 m 汽车参照、快速组合、平移缩放，以及包含署名和来源的 PNG 导出。长度均为教学用近似值。
- 年代与地图：交互时间条、现代发现地点与地区筛选，可直接进入物种档案。
- 馆藏检索：中文名和拉丁名搜索，按年代、食性和动物类别筛选。
- 收藏与探索手记：收藏、已看物种、知识标记及正确答题进度保存在当前浏览器，附主题探索路线；清理浏览器数据后会重置，不提供账号同步。
- 当前 14 个馆藏均为静态模型。霸王龙已换为 Pedro B. Goulart 原作中的独立模型，恢复中立站姿，避免卷尾动作影响体型比较。
- 手机端馆藏目录可左右滑动，桌面目录可滚动；支持通过 `?demo=museum&species=spinosaurus` 等链接直接打开物种。
- 可导入不超过 50 MB、包含贴图的 GLB，浏览器本地解析。

模型、皮肤贴图与 HDRI 均保存于 public，运行时无需连接 Sketchfab 或 Hugging Face。按当前物种加载资产；切换后释放 GPU 资源，原始文件缓存在当前页面内。

## 馆藏清单

| 馆藏 | 展示体长 | 模型作者 |
| --- | --- | --- |
| 三角龙 Triceratops | 9 m | wojciechmiedziocha |
| 霸王龙 Tyrannosaurus | 12 m | Pedro B. Goulart / Pebegou |
| 甲龙 Ankylosaurus | 8 m | pikabobalex |
| 棘龙 Spinosaurus | 14 m | Julian Johnson-Mortimer |
| 恐手龙 Deinocheirus | 10 m | Julian Johnson-Mortimer |
| 鲨齿龙 Carcharodontosaurus | 12.5 m | Julian Johnson-Mortimer |
| 镰刀龙 Therizinosaurus | 10 m | Julian Johnson-Mortimer |
| 高棘龙 Acrocanthosaurus | 12 m | Julian Johnson-Mortimer |
| 帝王角龙 Regaliceratops | 5 m | Julian Johnson-Mortimer |
| 帕卢克西龙 Paluxysaurus（旧名） | 18 m | Julian Johnson-Mortimer |
| 剑龙 Stegosaurus | 9 m | PAndras |
| 牛龙 Carnotaurus | 8 m | Cenker Turhan |
| 迅猛龙 Velociraptor | 1.8 m | Tomas Ibar |
| 海王龙 Tylosaurus（非恐龙） | 13 m | Julian Johnson-Mortimer |

## 来源与限制

模型作者、许可链接及修改说明见 [ATTRIBUTION.md](./ATTRIBUTION.md) 和 `public/models/credits.json`，页面“模型来源”也可查看。

14 份模型分别采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，森林 HDRI 采用 [CC0](https://polyhaven.com/license)。版权仍属于原作者；使用或再分发模型时，保留作者署名、原作与许可链接，并标明修改。授权以每份资产的原作记录为依据，不能从素材档案库的整体许可推断。

本次新增资产已做网页优化：简化网格、将贴图转为 WebP（最大 2048 像素），并保留原作署名元数据。牛龙移除了独立岩石；高棘龙和帝王角龙重算法线；帕卢克西龙转换了旧版材质；镰刀龙保留原作的幼体。各文件的实际大小、SHA-256 和完整变更记录见署名文件。

模型是艺术复原，尚未经过古生物学专业审核；自然环境只是氛围展示。尺寸按模型姿态中的头尾水平跨度校准，不是严格的骨骼测量。

迅猛龙模型沿用无羽毛的传统艺术造型，与支持羽毛的化石证据存在差异。帕卢克西龙保留模型旧名，其相关材料现通常归入波塞东龙。海王龙属于沧龙科海生爬行动物，并非恐龙。镰刀龙原作中的成幼体组合也不能用来证明特定群居或育幼行为。

电影及《方舟》中的名称可以帮助识别物种，但虚构习性不等于科学事实，作品中的模型、图像和音效也不因此获得使用许可。本馆没有选用已识别为游戏或电影提取物的资产。

这是免费的实时展示资产，细节与电影级复原仍有差距。旧版二维 AI 参考图保留在 public/references，但当前页面不把它们当作 3D 模型使用。

当前导入功能不配置 Draco / Meshopt / KTX2 解码器，也不播放任意导入文件的动画。内置资产已经处理为当前加载器支持的格式。

按用户要求，仅运行和修改本地版本。此前线上预览不会自动同步。
