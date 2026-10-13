export interface SpeciesProfile {
  group: "恐龙" | "翼龙" | "海生爬行动物";
  family: string;
  habitat: string;
  behavior: string;
  discovery: string;
  evidence: string;
  mediaNote: string;
  startMa: number;
  endMa: number;
  locations: { name: string; lat: number; lon: number }[];
  sources: { title: string; url: string }[];
}

const nhm = (slug: string) => ({
  title: "英国自然历史博物馆 · 物种档案",
  url: `https://www.nhm.ac.uk/discover/dino-directory/${slug}.html`,
});
const montana = { name: "美国 · 蒙大拿州", lat: 47, lon: -107 };
const mongolia = { name: "蒙古 · 内梅盖特盆地", lat: 43.5, lon: 100 };
const morocco = { name: "摩洛哥 · 卡姆卡姆地区", lat: 30.5, lon: -4.5 };

// Coordinates are representative modern regional locations, not excavation sites.
// Ma ranges are rounded educational summaries, not exact first/last appearances.
export const SPECIES_PROFILES: Record<string, SpeciesProfile> = {
  triceratops: {
    group: "恐龙",
    family: "角龙科 · 开角龙亚科",
    habitat:
      "生活在晚白垩世的北美西部。发现它的地层记录了河流、洪泛平原与植被丰富的陆地环境；今天的地貌不能直接代表当时的环境。",
    behavior:
      "用坚硬的喙剪切植物，再用成排的牙齿处理食物。角与颈盾可能参与防御和个体间展示，但我们不能由此断定它总是群居或性情温顺。",
    discovery:
      "早期发现的角芯曾被误认为巨型野牛的角。更多头骨让科学家认识到这是一种恐龙，Marsh 于 1889 年命名三角龙。",
    evidence:
      "头骨、牙齿和角芯提供了直接证据。角上原有的角质鞘、皮肤颜色以及具体的社会行为，需要与化石证据分开看待。",
    mediaNote:
      "电影与游戏常将它塑造成冲撞型动物。角是真实的解剖结构，固定攻击招式、驯服方式与阵营则属于创作。",
    startMa: 68,
    endMa: 66,
    locations: [montana, { name: "加拿大 · 阿尔伯塔省", lat: 51, lon: -113 }],
    sources: [
      nhm("triceratops"),
      {
        title: "史密森尼 · 最后的北美恐龙",
        url: "https://naturalhistory.si.edu/exhibits/last-american-dinosaurs-discovering-lost-world",
      },
    ],
  },
  tyrannosaurus: {
    group: "恐龙",
    family: "暴龙科 · 兽脚类",
    habitat:
      "化石主要见于北美西部晚白垩世地层，生活区域包括河流与洪泛平原。它与三角龙、甲龙等动物处于相近的时间和地域。",
    behavior:
      "强壮的颅骨和牙齿适合处理大型动物。研究支持其捕食能力，也不排除机会性食腐；捕猎和食腐并不是互斥的生活方式。",
    discovery:
      "Barnum Brown 在 1902 年于蒙大拿州找到用于正式命名的部分骨架。Henry Fairfield Osborn 于 1905 年发表名称 Tyrannosaurus rex。",
    evidence:
      "骨架、牙齿、咬痕与部分皮肤印痕帮助重建它的身体。是否稳定群猎、能跑多快以及叫声是什么样，仍存在证据和推算上的限制。",
    mediaNote:
      "游戏中的骑乘、驯服和数值战力属于玩法。展馆尺寸是代表性估计，不能用来给所有霸王龙个体排名。",
    startMa: 68,
    endMa: 66,
    locations: [
      montana,
      { name: "加拿大 · 萨斯喀彻温省", lat: 49.5, lon: -108 },
    ],
    sources: [
      nhm("tyrannosaurus"),
      {
        title: "美国自然历史博物馆 · 霸王龙的七个问题",
        url: "https://www.amnh.org/dinosaurs/tyrannosaurus-rex",
      },
      {
        title: "史密森尼 · 国家霸王龙",
        url: "https://naturalhistory.si.edu/explore/dinosaurs-fossils/nations-t-rex",
      },
    ],
  },
  ankylosaurus: {
    group: "恐龙",
    family: "甲龙科 · 甲龙类",
    habitat:
      "生活于北美西部的晚白垩世陆地生态系统。低矮的身体和植食性适应使科学家推测，它主要利用接近地面的植物资源。",
    behavior:
      "四足行走，以植物为食。尾槌可以向两侧摆动，可能用于防御；植食性并不意味着温顺，而具体性情无法从化石直接读出。",
    discovery:
      "1906 年，Barnum Brown 带领的考察队在蒙大拿州地狱溪组找到早期标本，1908 年正式命名。标志性的尾槌是在后续发现中补充认识的。",
    evidence:
      "已发现头骨、骨甲和部分骨架，但仍没有完整骨架。尤其背部骨甲原来的排列，不同复原可能有明显差异。",
    mediaNote:
      "游戏中的采矿、负重与尾槌技能并非古生物学结论。它确实有骨质护甲与尾槌，但它们不能证明采矿行为。",
    startMa: 68,
    endMa: 66,
    locations: [montana, { name: "加拿大 · 阿尔伯塔省", lat: 51, lon: -113 }],
    sources: [nhm("ankylosaurus")],
  },
  spinosaurus: {
    group: "恐龙",
    family: "棘龙科 · 兽脚类",
    habitat:
      "代表性化石来自北非，相关沉积环境包含河流和水域。白垩纪的北非与今天的撒哈拉沙漠很不一样。",
    behavior:
      "细长的吻部、圆锥形牙齿以及尾部结构表明它与水生食物关系密切。它如何在水中运动、是否进行持续潜水追猎，仍是研究议题。",
    discovery:
      "最初的埃及标本发现于 1912 年，Stromer 于 1915 年命名；原标本在 1944 年毁于战争。后来发现的北非材料不断改变它的复原。",
    evidence:
      "尾部、后肢比例和骨密度是讨论水生适应的重要依据；不同研究对水下捕猎能力有不同解释，不能把某一种复原当作最终答案。",
    mediaNote:
      "影视中的棘龙与霸王龙决斗是创作情节；两者的主要化石记录相隔数千万年，也来自不同大陆。",
    startMa: 99,
    endMa: 94,
    locations: [morocco, { name: "埃及 · 拜哈里耶绿洲", lat: 28.4, lon: 28.8 }],
    sources: [
      nhm("spinosaurus"),
      {
        title: "英国自然历史博物馆 · 棘龙类与水下捕食证据",
        url: "https://www.nhm.ac.uk/discover/news/2022/march/spinosaurus-baryonyx-may-have-hunted-fish-underwater.html",
      },
      {
        title: "英国自然历史博物馆 · 棘龙类的发现史",
        url: "https://www.nhm.ac.uk/discover/how-did-baryonyx-change-what-we-knew-about-spinosaurs.html",
      },
    ],
  },
  deinocheirus: {
    group: "恐龙",
    family: "恐手龙科 · 似鸟龙类",
    habitat:
      "发现于蒙古内梅盖特组。沉积环境与身体特征支持它生活在较湿润、靠近河流的环境中，而不是把今日戈壁的干旱直接套用到过去。",
    behavior:
      "宽阔的喙、躯干结构、胃石及胃部鱼类遗存共同支持杂食性解释。它可能利用植物和鱼类等食物，巨大的手臂不等于专门猎杀大型恐龙。",
    discovery:
      "1970 年命名时，科学家主要认识它的一双巨大前肢。2014 年发表的更完整材料揭示了宽吻、隆起背部和庞大的身体。",
    evidence:
      "鱼类残骸属于较直接的食性证据；植物性食物的推断还依赖颅骨和身体形态。羽毛覆盖范围和颜色仍需借助近亲比较与艺术复原。",
    mediaNote:
      "“恐怖的手”是名称含义，不是性格或危险等级。科普判断食性应看化石，而不是名字或游戏中的攻击力。",
    startMa: 70,
    endMa: 66,
    locations: [mongolia],
    sources: [
      nhm("deinocheirus"),
      {
        title: "Nature · 恐手龙新材料研究（2014）",
        url: "https://www.nature.com/articles/nature13874",
      },
    ],
  },
  carcharodontosaurus: {
    group: "恐龙",
    family: "鲨齿龙科 · 兽脚类",
    habitat:
      "北非的大型陆生捕食者。摩洛哥等地的白垩纪地层记录了水系和多样动物；地图展示代表性记录，不等于已知的全部分布范围。",
    behavior:
      "锯齿状、侧扁的牙齿适合切割肉。它很可能捕食其他大型动物，但确切猎物组合和是否群猎没有足够直接证据。",
    discovery:
      "Stromer 于 1931 年建立鲨齿龙属。此后的头骨发现丰富了认识；2025 年研究把曾归入鲨齿龙的一件埃及标本重新命名为 Tameryraptor。",
    evidence:
      "不完整的化石使全长、体重与外形存在估算差异。旧书中的所有“鲨齿龙”标本未必仍属于同一分类，档案需随研究更新。",
    mediaNote:
      "游戏中的连杀增益或战力排序不是科学习性。鲨齿龙与霸王龙的比较应同时考虑年代、地域和化石完整程度。",
    startMa: 99,
    endMa: 94,
    locations: [morocco, { name: "阿尔及利亚 · 撒哈拉地区", lat: 29, lon: 1 }],
    sources: [
      nhm("carcharodontosaurus"),
      {
        title: "PLOS ONE · 埃及鲨齿龙科标本重新研究（2025）",
        url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0311096",
      },
    ],
  },
  therizinosaurus: {
    group: "恐龙",
    family: "镰刀龙科 · 兽脚类",
    habitat:
      "化石来自蒙古，约生活在 7000 万年前。其植食性解释和近亲形态提示，它利用陆地植被；具体活动范围不能仅凭少量骨骼确定。",
    behavior:
      "虽然属于包含众多肉食恐龙的兽脚类，它通常被解释为植食者。长爪可能与取食、展示或防御有关，不宜把某一种用途说成已被证实。",
    discovery:
      "Maleev 于 1954 年命名。这个动物最初因巨大的爪骨引起关注；目前仍主要由部分四肢、爪和肋骨等材料认识。",
    evidence:
      "巨大爪骨是真实化石证据，全身比例和头部则很大程度参考近亲。复原图中的羽毛、颜色和表情并不是直接保存的事实。",
    mediaNote:
      "电影中失明、狂暴的个体只是角色设定。没有理由认为镰刀龙这个物种普遍失明，也不能从爪的长度断言其性情。模型中的幼体场景为艺术创作，不能据此认定其育幼行为。",
    startMa: 70,
    endMa: 70,
    locations: [mongolia],
    sources: [
      nhm("therizinosaurus"),
      {
        title: "西澳大利亚博物馆 · 镰刀龙",
        url: "https://museum.wa.gov.au/explore/dinosaur-discovery/therizinosaurus",
      },
    ],
  },
  acrocanthosaurus: {
    group: "恐龙",
    family: "鲨齿龙科 · 兽脚类",
    habitat:
      "化石见于北美，代表性发现包括美国俄克拉何马州和得克萨斯州。它生活在早白垩世，比霸王龙早了数千万年。",
    behavior:
      "大型陆生肉食者，头部和刀状牙齿适合处理动物食物。背部高大的神经棘是显著特征，但其软组织外形和功能仍有解释空间。",
    discovery:
      "Stovall 与 Langston 于 1950 年命名，名字意为“高棘蜥蜴”。北卡罗来纳自然科学博物馆的重要标本保存了完整头骨及大量身体骨骼。",
    evidence:
      "骨架支持对身体结构的认识。大型兽脚类足迹有时被联系到高棘龙，但只凭足迹通常不能精确确认到属，更不能直接还原一场追猎。",
    mediaNote:
      "不能把长得像霸王龙理解为霸王龙的同类个体：高棘龙属于鲨齿龙科，生存年代也明显更早。",
    startMa: 115,
    endMa: 105,
    locations: [
      { name: "美国 · 俄克拉何马州", lat: 34, lon: -95 },
      { name: "美国 · 得克萨斯州", lat: 32, lon: -98 },
    ],
    sources: [
      nhm("acrocanthosaurus"),
      {
        title: "北卡罗来纳自然科学博物馆 · 高棘龙问答",
        url: "https://www.naturalsciences.org/learn/faqs/acro-faq",
      },
      {
        title: "PLOS ONE · 高棘龙颅骨研究（2011）",
        url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0017932",
      },
    ],
  },
  regaliceratops: {
    group: "恐龙",
    family: "角龙科 · 开角龙亚科",
    habitat:
      "来自加拿大阿尔伯塔省西南部圣玛丽河组，年代约 6850–6750 万年前。它属于晚白垩世北美西部的角龙类。",
    behavior:
      "依据角龙科的颌部结构及近亲资料，它被解释为四足植食动物。冠状颈盾和角可能参与展示，但具体社会组织尚不能确定。",
    discovery:
      "Brown 与 Henderson 在 2015 年依据一件近乎完整、立体保存的头骨命名。其突出的鼻角、较小眉角与颈盾边缘骨饰形成特殊组合。",
    evidence:
      "头骨特征证据较强，身体比例更多依靠近亲推断。论文讨论的是角饰形态的趋同演化，并非证实它与另一类角龙拥有相同生活习性。",
    mediaNote:
      "它不是给三角龙换一个王冠：两者是不同的属。模型身体和肤色属于艺术复原，识别重点是头骨结构。",
    startMa: 68.5,
    endMa: 67.5,
    locations: [{ name: "加拿大 · 阿尔伯塔省", lat: 51, lon: -113 }],
    sources: [
      {
        title: "Current Biology · 帝王角龙原始描述（2015）",
        url: "https://www.sciencedirect.com/science/article/pii/S0960982215004923",
      },
      {
        title: "犹他自然历史博物馆 · 原始论文全文",
        url: "https://nhmu.utah.edu/sites/default/files/trail-resource/New%20Horned%20Dinosaur%20.pdf",
      },
    ],
  },
  tylosaurus: {
    group: "海生爬行动物",
    family: "沧龙科 · 海王龙亚科",
    habitat:
      "生活在晚白垩世海洋，北美西部内陆海道留下了许多化石。今天远离海岸的堪萨斯州，当时曾被海水覆盖。",
    behavior:
      "利用适应游泳的身体、鳍状肢和尾部在海中活动，是海洋肉食性爬行动物。它需要到水面呼吸，不能因外形像鱼就把它当成鱼类。",
    discovery:
      "堪萨斯大学收藏的一件著名大型标本，由 Charles Bunker 团队于 1911 年在堪萨斯州发现。不同海王龙标本属于不同时间、体型和种。",
    evidence:
      "海相地层中的骨架支持其海洋生活。此处时间条展示约 8500–8200 万年前的代表性化石年代，不代表整个属完整的生存范围。",
    mediaNote:
      "海王龙属于沧龙科，是海生蜥蜴的近亲，并非恐龙；它也不能与影视作品中的“沧龙”角色直接画等号。",
    startMa: 85,
    endMa: 82,
    locations: [{ name: "美国 · 堪萨斯州", lat: 38.8, lon: -100 }],
    sources: [
      {
        title: "堪萨斯大学自然历史博物馆 · 海王龙标本",
        url: "https://biodiversity.ku.edu/exhibits/mosasaur",
      },
      {
        title: "堪萨斯大学 · 海王龙与白垩纪海道",
        url: "https://news.ku.edu/news/article/2014/04/09/kansas-designates-two-official-state-fossils",
      },
      {
        title: "堪萨斯大学 · 约 8200 万年前的海王龙化石",
        url: "https://eeec.ku.edu/mosasaur-and-sea-turtle",
      },
    ],
  },
  paluxysaurus: {
    group: "恐龙",
    family: "蜥脚类 · 巨龙形类（旧名档案）",
    habitat:
      "相关化石来自美国得克萨斯州北中部的早白垩世地层。当地当时邻近扩张中的海域，长颈植食动物生活在陆地植被环境中。",
    behavior:
      "柱状四肢支撑庞大的身体，长颈扩大取食范围。四具个体的化石共同用于博物馆复原，但同处一个埋藏点并不能单独证明固定群居。",
    discovery:
      "名称来自得克萨斯州 Paluxy 一带的 Jones 牧场发现地。此模型沿用 Paluxysaurus 旧名；后续分类研究将相关材料归入 Sauroposeidon（波塞东龙）。",
    evidence:
      "展示体长约 18 米，参考沃思堡博物馆旧名标本的约 60 英尺复原，不代表波塞东龙属所有个体。分类归并与身体尺寸都需要联系具体标本。",
    mediaNote:
      "它不是《方舟》里“雷龙”的另一个名字：这里展示的是实际化石分类与模型旧名称的对应关系，不采用游戏中的角色数值。",
    startMa: 115,
    endMa: 110,
    locations: [{ name: "美国 · 得克萨斯州", lat: 32, lon: -98 }],
    sources: [
      {
        title: "沃思堡科学与历史博物馆 · Paluxysaurus 展品",
        url: "https://www.fwmuseum.org/explore/exhibits/",
      },
      {
        title: "沃思堡博物馆 · 古生物发现口述史",
        url: "https://www.fwmuseum.org/paleontology-oral-history-project/",
      },
      {
        title: "系统古生物学期刊 · 北美蜥脚类分类修订",
        url: "https://www.tandfonline.com/doi/abs/10.1080/14772019.2012.667446",
      },
    ],
  },
  stegosaurus: {
    group: "恐龙",
    family: "剑龙科 · 剑龙类",
    habitat:
      "生活在侏罗纪晚期，北美西部保存了重要化石。英国自然历史博物馆的近乎完整标本来自美国怀俄明州，约有 1.5 亿年历史。",
    behavior:
      "四足植食动物，尾部尖刺可用于防御。背板可能涉及展示、识别或体温调节，但科学家仍在讨论各种解释。",
    discovery:
      "Marsh 于 1877 年命名剑龙。他早期曾以为骨板平铺在背上；随着保存更好、位置关系更清楚的标本出现，复原逐渐改变。",
    evidence:
      "背板原来嵌在皮肤中，通常不会与骨架保持连接。骨骼能说明身体结构，却不能直接告诉我们每块骨板的颜色与所有功能。",
    mediaNote:
      "剑龙确实属于侏罗纪，与霸王龙相隔约八千万年。把它们放在同一个展馆便于比较，不代表它们在自然界相遇过。",
    startMa: 152,
    endMa: 145,
    locations: [{ name: "美国 · 怀俄明州", lat: 43, lon: -107 }],
    sources: [
      nhm("stegosaurus"),
      {
        title: "英国自然历史博物馆 · 剑龙专家访谈",
        url: "https://www.nhm.ac.uk/discover/stegosaurus-interview-dinosaur-expert.html",
      },
    ],
  },
  carnotaurus: {
    group: "恐龙",
    family: "阿贝力龙科 · 角鼻龙类",
    habitat:
      "化石发现于阿根廷晚白垩世地层。相关岩层可能由河口或潮坪沉积形成，今天的南美洲位置只是理解发现地的参照。",
    behavior:
      "肉食性恐龙，短而深的头部有一对角，前肢极度缩小。角可能用于展示或个体间互动；确切用途与猎物种类都没有定论。",
    discovery:
      "Bonaparte 于 1985 年命名 Carnotaurus sastrei，名字意为“食肉的公牛”。重要标本不仅保留骨骼，也留下了珍贵的皮肤印痕。",
    evidence:
      "皮肤印痕直接支持身体多处覆盖鳞片。尾部与后肢末端的缺失部分仍需参考近亲，因此完整模型并不等于完整化石。",
    mediaNote:
      "小说中的变色伪装是创作设定，没有证据证明食肉牛龙拥有这种能力。它也不是长角的霸王龙，而是不同支系的兽脚类。",
    startMa: 71,
    endMa: 69,
    locations: [{ name: "阿根廷 · 巴塔哥尼亚", lat: -43.7, lon: -68 }],
    sources: [nhm("carnotaurus")],
  },
  velociraptor: {
    group: "恐龙",
    family: "驰龙科 · 兽脚类",
    habitat:
      "代表性化石发现于蒙古，生活在晚白垩世。它是一种体型较小、双足行走的陆生恐龙，体长还包括很长的尾巴。",
    behavior:
      "尖锐牙齿和第二脚趾上弯曲的大爪与肉食生活有关。可以肯定它捕食动物，但影视里严密协作、服从人类指令的群体行为没有对应证据。",
    discovery:
      "Osborn 于 1924 年命名。2007 年研究在一件前臂化石上识别出羽茎瘤，即羽毛附着位置，为它拥有羽毛提供了直接证据。",
    evidence:
      "真实迅猛龙有羽毛证据，且不能飞翔。当前授权模型是无羽毛的传统艺术复原，并不符合这一重要证据；请把模型当作展示素材，而非标准科学复原。",
    mediaNote:
      "《侏罗纪公园》的“迅猛龙”明显放大，并参考了更大的恐爪龙。本馆按约 2 米的真实体长级别展示；无羽毛外观也不是科学结论。",
    startMa: 74,
    endMa: 70,
    locations: [{ name: "蒙古 · 戈壁地区", lat: 44, lon: 104 }],
    sources: [
      nhm("velociraptor"),
      {
        title: "美国自然历史博物馆 · 迅猛龙羽毛证据",
        url: "https://www.amnh.org/explore/news-blogs/velociraptor-feather-evidence",
      },
      {
        title: "美国自然历史博物馆 · 认识迅猛龙",
        url: "https://www.amnh.org/explore/news-blogs/velociraptor",
      },
    ],
  },
};
