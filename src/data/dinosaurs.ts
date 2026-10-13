import { ADDITIONAL_DINOSAURS } from "./additionalDinosaurs";

export type SpeciesId =
  | "triceratops"
  | "tyrannosaurus"
  | "ankylosaurus"
  | "spinosaurus"
  | "deinocheirus"
  | "carcharodontosaurus"
  | "therizinosaurus"
  | "acrocanthosaurus"
  | "regaliceratops"
  | "paluxysaurus"
  | "stegosaurus"
  | "carnotaurus"
  | "velociraptor"
  | "tylosaurus";
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
  asset: {
    title: string;
    author: string;
    url: string;
    rotationY: number;
    animated: boolean;
  };
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
        point: [0.32, 0.84, 0.28],
        text: "两根较长的角位于眼睛上方，另一根长在鼻部。角可能用于防御和个体间的争斗，不能仅凭外形认定它们只有一种用途。",
      },
      {
        id: "frill",
        title: "宽大的颈盾",
        short: "颈盾",
        point: [0.17, 0.78, 0.32],
        text: "头骨后方延伸出的骨质颈盾是角龙类的显著特征。它的功能仍有讨论，可能与防护、展示和同类识别有关。",
      },
      {
        id: "beak",
        title: "切割植物的喙",
        short: "喙",
        point: [0.46, 0.41, 0.12],
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
    asset: {
      title: "Triceratops dinosaur",
      author: "wojciechmiedziocha",
      url: "https://sketchfab.com/3d-models/triceratops-dinosaur-87527079bad44917ab1b98a456b46c7e",
      rotationY: Math.PI / 2,
      animated: false,
    },
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
        point: [0.37, 0.84, 0.12],
        text: "霸王龙的头骨很大，牙齿粗壮。它的颌部适合处理动物食物，化石上的咬痕也为研究它的取食行为提供了证据。",
      },
      {
        id: "arms",
        title: "短小的前肢",
        short: "前肢",
        point: [0.13, 0.5, 0.22],
        text: "霸王龙的前肢相对短小，每只手有两根手指。前肢的具体用途仍有争论，不能把某一种解释当作已经确定的结论。",
      },
      {
        id: "tail",
        title: "长尾巴",
        short: "尾巴",
        point: [-0.34, 0.65, 0.04],
        text: "长尾从躯干后方向外延伸，与沉重的头部保持平衡。当前模型采用静态站姿，软组织与皮肤颜色属于艺术复原。",
      },
    ],
    question: {
      prompt: "霸王龙每只手有几根手指？",
      options: ["两根", "三根", "五根"],
      answer: 0,
      explanation: "答对了！霸王龙每只手有两根手指。",
    },
    source: "https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html",
    asset: {
      title: "Dino Fight · Tyrannosaurus",
      author: "Pedro B. Goulart",
      url: "https://sketchfab.com/3d-models/dino-fight-e06271daec3b431388640435f211f874",
      rotationY: Math.PI / 2,
      animated: false,
    },
  },
  {
    id: "ankylosaurus",
    name: "甲龙",
    latin: "Ankylosaurus",
    number: "03",
    length: 8,
    color: "#879886",
    period: "白垩纪晚期",
    age: "约 6800–6600 万年前",
    diet: "植食性",
    region: "北美洲",
    description:
      "低矮宽阔的身体、覆盖皮肤的骨甲和沉重的尾锤，构成了甲龙醒目的轮廓。它用四条腿支撑身体，取食低处的植物。骨甲的具体排列仍有不确定性。",
    hotspots: [
      {
        id: "armour",
        title: "覆盖身体的骨甲",
        short: "骨甲",
        point: [0, 0.88, 0.28],
        text: "骨质甲片嵌在皮肤中，形成防护。已发现的甲龙化石并不完整，因此背部骨甲如何排列仍需要研究；模型展示的是一种艺术复原。",
      },
      {
        id: "club",
        title: "尾端的骨质尾锤",
        short: "尾锤",
        point: [-0.44, 0.65, 0],
        text: "尾端膨大的骨质结构形成尾锤，可能用于防御。尾部的结构允许有力地左右摆动，但上下活动的范围可能有限。",
      },
      {
        id: "head",
        title: "贴近地面的头部",
        short: "头部",
        point: [0.39, 0.38, 0.2],
        text: "甲龙的头部靠近地面，适合取食蕨类、灌木等低矮植物。它是一种植食性恐龙，口前部有喙。",
      },
    ],
    question: {
      prompt: "甲龙尾巴末端最显眼的结构是什么？",
      options: ["骨质尾锤", "羽毛扇", "长颈盾"],
      answer: 0,
      explanation: "答对了！甲龙尾巴末端有沉重的骨质尾锤。",
    },
    source: "https://www.nhm.ac.uk/discover/dino-directory/Ankylosaurus.html",
    asset: {
      title: "Dino - Ankylosaurus",
      author: "pikabobalex",
      url: "https://sketchfab.com/3d-models/dino-ankylosaurus-55b9adcbcf7846e8a833bfc77eaf3d3f",
      rotationY: Math.PI / 2,
      animated: false,
    },
  },
  {
    id: "spinosaurus",
    name: "棘龙",
    latin: "Spinosaurus",
    number: "04",
    length: 14,
    color: "#947053",
    period: "白垩纪晚期",
    age: "约 9900–9400 万年前",
    diet: "肉食性 · 包括鱼类",
    region: "北非",
    description:
      "高耸的背帆、狭长的吻部和宽阔的尾巴，让棘龙显得格外特别。它生活在北非，与水域关系密切；究竟多善于游泳、如何捕食，仍在研究中。",
    hotspots: [
      {
        id: "sail",
        title: "高耸的背帆",
        short: "背帆",
        point: [0.03, 0.89, 0.06],
        text: "背部延长的神经棘支撑着帆状结构。展示、体温调节等功能都曾被提出，目前没有一种解释得到完全确认。",
      },
      {
        id: "snout",
        title: "狭长的吻部",
        short: "吻部",
        point: [0.43, 0.53, 0.1],
        text: "狭长的颌部带有圆锥状牙齿，有利于抓住鱼类等猎物。棘龙会吃鱼，但这不意味着它只吃鱼。",
      },
      {
        id: "paddle",
        title: "宽阔的尾部",
        short: "尾部",
        point: [-0.34, 0.38, 0.06],
        text: "棘龙的尾部具有宽阔、近似桨状的轮廓，是研究水域适应的重要线索。它是在水中追猎还是主要在岸边捕食，仍存在争论。",
      },
    ],
    question: {
      prompt: "关于棘龙，哪种说法更准确？",
      options: ["它只吃鱼", "它吃鱼，也可能吃其他动物", "它只吃植物"],
      answer: 1,
      explanation: "答对了！颌部结构支持棘龙取食鱼类，但不能据此认定它只吃鱼。",
    },
    source: "https://www.nhm.ac.uk/discover/dino-directory/spinosaurus.html",
    asset: {
      title: "Spinosaurus",
      author: "Julian Johnson-Mortimer",
      url: "https://sketchfab.com/3d-models/spinosaurus-4f2332ee93874d59a55fb60ed2873ec2",
      rotationY: Math.PI / 2,
      animated: false,
    },
  },
  {
    id: "deinocheirus",
    name: "恐手龙",
    latin: "Deinocheirus",
    number: "05",
    length: 10,
    color: "#9a7864",
    period: "白垩纪晚期",
    age: "约 7000–6600 万年前",
    diet: "杂食性",
    region: "蒙古",
    description:
      "科学家最初只见到它巨大的手臂和爪。后来发现的化石，才拼出这位奇特居民的模样：宽大的喙、隆起的背部，以及笨重的身躯。",
    hotspots: [
      {
        id: "hands",
        title: "巨大的前肢",
        short: "前肢",
        point: [0.22, 0.38, 0.35],
        text: "恐手龙的名字意为“恐怖的手”。最初发现的巨大前肢曾让它显得十分神秘，不过大爪子并不能证明它是凶猛的肉食猎手。",
      },
      {
        id: "beak",
        title: "宽大的喙",
        short: "喙",
        point: [0.45, 0.84, 0.13],
        text: "头部带有鸭嘴般宽大的喙。恐手龙被认为是杂食性恐龙，不能只凭庞大的体型和爪子判断它吃什么。",
      },
      {
        id: "hump",
        title: "隆起的背部",
        short: "背部",
        point: [0.06, 0.78, 0.14],
        text: "延长的背部骨骼支撑着醒目的隆起。2014 年发表的新材料，让科学家对恐手龙整体外形的认识发生了很大变化。",
      },
    ],
    question: {
      prompt: "恐手龙被认为具有哪种食性？",
      options: ["只吃大型恐龙", "只吃树叶", "杂食性"],
      answer: 2,
      explanation:
        "答对了！恐手龙被认为是杂食性恐龙，巨大前爪并不等于肉食猎手。",
    },
    source: "https://www.nhm.ac.uk/discover/dino-directory/Deinocheirus.html",
    asset: {
      title: "Deinocheirus",
      author: "Julian Johnson-Mortimer",
      url: "https://sketchfab.com/3d-models/deinocheirus-893d4de08a9e4788938d370b8ad72c17",
      rotationY: Math.PI / 2,
      animated: false,
    },
  },
  {
    id: "carcharodontosaurus",
    name: "鲨齿龙",
    latin: "Carcharodontosaurus",
    number: "06",
    length: 12.5,
    color: "#718280",
    period: "白垩纪晚期",
    age: "约 9900–9400 万年前",
    diet: "肉食性",
    region: "北非",
    description:
      "这位北非大型捕食者，因牙齿形似鲨鱼牙而得名。它的体长可与霸王龙相比，但颌部和牙齿的结构不同；不完整的化石也让尺寸估计存在不确定性。",
    hotspots: [
      {
        id: "teeth",
        title: "形似鲨鱼的牙齿",
        short: "牙齿",
        point: [0.4, 0.75, 0.19],
        text: "鲨齿龙的牙齿适合切割动物组织，外形让研究者联想到鲨鱼的牙齿。名字相似，并不代表它与鲨鱼有特别近的亲缘关系。",
      },
      {
        id: "skull",
        title: "巨大的头部",
        short: "头部",
        point: [0.32, 0.92, 0.16],
        text: "它的头骨十分巨大，但不能据此认为咬合方式与霸王龙相同。研究认为，鲨齿龙的牙齿更适合撕切肉，而不是强力压碎骨头。",
      },
      {
        id: "legs",
        title: "支撑身体的后肢",
        short: "后肢",
        point: [-0.03, 0.28, 0.31],
        text: "鲨齿龙以两条后腿行走。身体长度采用资料中的代表性估计；不同个体、缺失骨骼与复原姿态，都会影响体型比较。",
      },
    ],
    question: {
      prompt: "“鲨齿龙”这个名字主要指什么？",
      options: ["牙齿形似鲨鱼牙", "它生活在深海", "它是鲨鱼的祖先"],
      answer: 0,
      explanation: "答对了！这个名字来自牙齿的外形，并不表示它是鲨鱼的近亲。",
    },
    source:
      "https://www.nhm.ac.uk/discover/dino-directory/carcharodontosaurus.html",
    asset: {
      title: "Carcharodontosaurus",
      author: "Julian Johnson-Mortimer",
      url: "https://sketchfab.com/3d-models/carcharodontosaurus-550124bde61b4c988580bf9a0b9053b8",
      rotationY: Math.PI / 2,
      animated: false,
    },
  },
  ...ADDITIONAL_DINOSAURS,
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
