export type SpeciesId = "triceratops" | "tyrannosaurus" | "brachiosaurus";
export type DemoMode = "museum" | "explore" | "compare";
export type ViewPreset = "front" | "side" | "reset";

export interface Hotspot {
  id: string;
  title: string;
  short: string;
  text: string;
  point: [number, number, number];
}

export interface Dinosaur {
  id: SpeciesId;
  name: string;
  latin: string;
  number: string;
  length: number;
  color: string;
  period: string;
  age: string;
  diet: string;
  region: string;
  description: string;
  hotspots: Hotspot[];
  question: {
    prompt: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  source: string;
}

export const DINOSAURS: Dinosaur[] = [
  {
    id: "triceratops",
    name: "三角龙",
    latin: "Triceratops",
    number: "01",
    length: 9,
    color: "#75846a",
    period: "白垩纪晚期",
    age: "约 6800–6600 万年前",
    diet: "植食性",
    region: "北美洲",
    description:
      "三根角和宽大的颈盾，让三角龙很容易被认出来。它用喙切下植物，再用口腔后部的牙齿处理食物。颈盾可能承担防护、展示或识别等多种作用。",
    hotspots: [
      {
        id: "horns",
        title: "三根角",
        short: "角",
        point: [2.1, 2.55, 0.58],
        text: "两根较长的角位于眼睛上方，另一根长在鼻部。角可能用于防御和个体间的争斗，不能仅凭外形认定它们只有一种用途。",
      },
      {
        id: "frill",
        title: "宽大的颈盾",
        short: "颈盾",
        point: [0.9, 2.6, 0.75],
        text: "头骨后方延伸出的骨质颈盾是角龙类的显著特征。它的功能仍有讨论，可能与防护、展示和同类识别有关。",
      },
      {
        id: "beak",
        title: "切割植物的喙",
        short: "喙",
        point: [2.56, 1.22, 0.28],
        text: "前部的喙适合剪切植物。三角龙是植食性恐龙，口腔后部还有成排的牙齿，帮助处理坚韧的植物材料。",
      },
    ],
    question: {
      prompt: "三角龙主要吃什么？",
      options: ["植物", "其他恐龙", "鱼类"],
      answer: 0,
      explanation: "答对了！三角龙的喙和牙齿适合切割、处理植物。",
    },
    source: "https://www.nhm.ac.uk/discover/dino-directory/triceratops.html",
  },
  {
    id: "tyrannosaurus",
    name: "霸王龙",
    latin: "Tyrannosaurus",
    number: "02",
    length: 12,
    color: "#a48159",
    period: "白垩纪晚期",
    age: "约 6800–6600 万年前",
    diet: "肉食性",
    region: "北美洲",
    description:
      "巨大的头部、强壮的后肢和相对短小的前肢，构成了霸王龙醒目的轮廓。它用两条后腿行走，可能既捕猎，也取食动物尸体。",
    hotspots: [
      {
        id: "jaw",
        title: "有力的颌部",
        short: "颌部",
        point: [2.32, 3.55, 0.44],
        text: "霸王龙的头骨很大，牙齿粗壮。它的颌部适合处理动物食物，化石上的咬痕也为研究它的取食行为提供了证据。",
      },
      {
        id: "arms",
        title: "短小的前肢",
        short: "前肢",
        point: [1.12, 2.15, 0.62],
        text: "霸王龙的前肢相对短小，每只手有两根手指。前肢的具体用途仍有争论，不能把某一种解释当作已经确定的结论。",
      },
      {
        id: "tail",
        title: "长尾巴",
        short: "尾巴",
        point: [-2.4, 2.1, 0.15],
        text: "观察它的整体轮廓：尾巴从躯干后方向外延伸。这个模型用简化的几何形状表现长尾结构，动作演示不代表经过验证的运动复原。",
      },
    ],
    question: {
      prompt: "霸王龙每只手有几根手指？",
      options: ["两根", "三根", "五根"],
      answer: 0,
      explanation: "答对了！霸王龙每只手有两根手指。",
    },
    source: "https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html",
  },
  {
    id: "brachiosaurus",
    name: "腕龙",
    latin: "Brachiosaurus",
    number: "03",
    length: 22,
    color: "#879886",
    period: "侏罗纪晚期",
    age: "约 1.52–1.45 亿年前",
    diet: "植食性",
    region: "北美洲",
    description:
      "腕龙有长长的脖子，前肢比后肢更长，身体轮廓向前上方倾斜。研究者认为它可能取食高处的树叶。其完整外观复原仍包含推测。",
    hotspots: [
      {
        id: "neck",
        title: "长长的脖子",
        short: "颈部",
        point: [1.5, 4.2, 0.28],
        text: "长颈让腕龙能够接近较高处的植物。模型中的颈部姿态是展示用的简化示意，不代表唯一的科学复原姿态。",
      },
      {
        id: "forelegs",
        title: "较长的前肢",
        short: "前肢",
        point: [1.12, 1.38, 0.62],
        text: "腕龙的前肢比后肢更长，这是它与一些其他长颈恐龙的明显区别，也使它的躯干呈现向前上方倾斜的轮廓。",
      },
      {
        id: "head",
        title: "小小的头部",
        short: "头部",
        point: [2.03, 5.76, 0.3],
        text: "相对于巨大的身体，腕龙的头部显得很小。已发现的骨骼不完整，很多全身复原会参考近缘恐龙，因此细节需要谨慎看待。",
      },
    ],
    question: {
      prompt: "腕龙的前肢与后肢相比，哪种描述更合适？",
      options: ["前肢更长", "后肢更长", "没有前肢"],
      answer: 0,
      explanation: "答对了！腕龙的前肢更长，躯干因此向前上方倾斜。",
    },
    source: "https://www.nhm.ac.uk/discover/dino-directory/brachiosaurus.html",
  },
];

export const DEMOS: {
  id: DemoMode;
  number: string;
  name: string;
  description: string;
}[] = [
  {
    id: "museum",
    number: "01",
    name: "模型展馆",
    description: "从每一个角度，认识史前居民。",
  },
  {
    id: "explore",
    number: "02",
    name: "科普探索",
    description: "点击身体标记，发现恐龙的秘密。",
  },
  {
    id: "compare",
    number: "03",
    name: "体型比较",
    description: "同一把尺，看看恐龙究竟有多大。",
  },
];

export function getDinosaur(id: SpeciesId) {
  return DINOSAURS.find((d) => d.id === id)!;
}
