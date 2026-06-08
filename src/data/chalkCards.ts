// チョーク図鑑のカードデータ。サイトの核となるコレクション要素。
// front=やさしい一言（全年齢）/ back=大人向けトリビア。事実は docs/gemini-research.md 由来。

export type CardCategory =
  | 'board'     // 黒板用
  | 'material'  // 成分
  | 'legend'    // 伝説
  | 'geology'   // 地質
  | 'eco'       // エコ
  | 'sports'    // スポーツ・特殊
  | 'health'    // 健康・掃除
  | 'compare';  // 比較

export type ChalkCard = {
  id: string;
  name: string;
  emoji: string;
  rarity: 1 | 2 | 3;          // レア度（固定）。3がもっとも希少
  category: CardCategory;
  front: string;              // 表面：やさしい一言
  back: string;               // 裏面：もう一歩くわしいトリビア
  relatedSectionId: string;   // このよみものを読むと「発見」
};

export const CATEGORY_LABEL: Record<CardCategory, string> = {
  board: '黒板用',
  material: '成分',
  legend: '伝説',
  geology: '地質',
  eco: 'エコ',
  sports: 'スポーツ・特殊',
  health: '健康・掃除',
  compare: '比較',
};

export const CHALK_CARDS: ChalkCard[] = [
  // ── 黒板用 ──
  {
    id: 'white-chalk', name: '白墨（はくぼく）', emoji: '✏️', rarity: 1, category: 'board',
    front: 'いちばん基本の白いチョーク。黒板に本文を書く主役。',
    back: '摩擦で削れた粉が、黒板表面の細かいデコボコにひっかかって文字になる。鉛筆が紙に黒鉛をのせるのと同じ原理。',
    relatedSectionId: 'basics',
  },
  {
    id: 'color-chalk', name: '色チョーク', emoji: '🎨', rarity: 1, category: 'board',
    front: '赤・青・黄・緑など。強調や図に使う。',
    back: '白い土台に顔料（色のもとの粉）を混ぜて作る。色だけで区別せず下線や囲みも添えると、より多くの人に伝わる。',
    relatedSectionId: 'types',
  },
  {
    id: 'dustless', name: 'ダストレスチョーク', emoji: '🌀', rarity: 2, category: 'board',
    front: '粉が舞い散りにくいチョーク。今の学校の主流。',
    back: '「粉ゼロ」ではなく「舞いにくい」の意味。比重の大きい炭酸カルシウムを高密度に固め、消したとき粉が垂直に落ちやすくしている。',
    relatedSectionId: 'types',
  },
  {
    id: 'luminous', name: '蛍光チョーク', emoji: '✨', rarity: 2, category: 'board',
    front: '暗い教室でもくっきり見える、発色の強いチョーク。',
    back: '顔料を多めに入れるため、やや消えにくい。別珍（ベロア）生地の黒板消しが向いている。',
    relatedSectionId: 'types',
  },

  // ── 成分 ──
  {
    id: 'calcium-carbonate', name: '炭酸カルシウム', emoji: '🐚', rarity: 1, category: 'material',
    front: '石灰石や貝殻の主成分。チョークの主要な材料。',
    back: '粒が詰まって折れにくく、粉が散りにくい。ダストレスチョークの土台になる身近な鉱物。',
    relatedSectionId: 'basics',
  },
  {
    id: 'gypsum', name: '石膏（せっこう）', emoji: '🧱', rarity: 2, category: 'material',
    front: '焼き石膏に水を混ぜると固まる、もう一つのチョーク材料。',
    back: '硫酸カルシウム。水和反応で固まると元の粉には戻らない（不可逆）。やわらかく太字向きだが粉が舞いやすい。',
    relatedSectionId: 'making',
  },

  // ── 伝説 ──
  {
    id: 'hagoromo', name: '羽衣（ハゴロモ）チョーク', emoji: '👑', rarity: 3, category: 'legend',
    front: '「チョーク界のロールスロイス」と呼ばれた伝説の名品。',
    back: 'なめらかな書き味・折れにくさ・手が汚れにくさで世界の数学者に愛された。2015年の廃業時は買いだめ騒動「Chalkapocalypse」が発生。製法は韓国に受け継がれた。',
    relatedSectionId: 'hagoromo',
  },

  // ── 地質 ──
  {
    id: 'chalk-rock', name: '白亜（はくあ）', emoji: '⛰️', rarity: 2, category: 'geology',
    front: '白くやわらかい石灰岩。英語で chalk＝チョークそのもの。',
    back: '昔の黒板チョークはこの天然の白亜を削って作られた。チョークの名前はこの岩に由来する。',
    relatedSectionId: 'geology',
  },
  {
    id: 'coccolith', name: '円石藻（えんせきそう）', emoji: '🦠', rarity: 3, category: 'geology',
    front: '白い崖を作った、目に見えない小さなプランクトン。',
    back: '炭酸カルシウムの殻（コッコリス）の大きさは髪の毛の太さの約10分の1。その殻が積もり固まって白亜の地層になった。',
    relatedSectionId: 'geology',
  },
  {
    id: 'cretaceous', name: '白亜紀（はくあき）', emoji: '🦕', rarity: 2, category: 'geology',
    front: '恐竜が栄えた時代。名前の由来はチョーク。',
    back: '英語 Cretaceous はラテン語でチョークを意味する creta が語源。この時代に円石藻が大量に増え、分厚い白亜の地層を作った。',
    relatedSectionId: 'geology',
  },

  // ── エコ ──
  {
    id: 'scallop', name: 'ホタテ貝殻チョーク', emoji: '🐚', rarity: 3, category: 'eco',
    front: '捨てられるホタテの貝殻から生まれたエコなチョーク。',
    back: '貝殻は高純度の炭酸カルシウム。混ぜすぎると硬くなりすぎるため、一定割合だけ配合して折れにくさと書き味を両立。資源の循環の好例。',
    relatedSectionId: 'making',
  },
  {
    id: 'eggshell', name: '卵殻チョーク', emoji: '🥚', rarity: 2, category: 'eco',
    front: '卵の殻（卵殻カルシウム）を活かしたチョークもある。',
    back: 'ホタテ貝殻と同じ発想。捨てられる資源を毎日使う道具に変える取り組みのひとつ。',
    relatedSectionId: 'making',
  },

  // ── スポーツ・特殊 ──
  {
    id: 'climbing', name: 'クライミングチョーク', emoji: '🧗', rarity: 2, category: 'sports',
    front: '手にぬる白い粉。すべり止め…ではない？',
    back: '主成分は炭酸マグネシウム。摩擦を増やすのではなく、手の汗を吸ってサラサラに保つことで「汗によるすべり」を取りのぞくのが本当の役割。',
    relatedSectionId: 'sports',
  },
  {
    id: 'billiard', name: 'ビリヤードチョーク', emoji: '🎱', rarity: 2, category: 'sports',
    front: 'キュー先にこすりつける、青や緑の小さな立方体。',
    back: 'キュー先の革と球がすべらないよう摩擦をつける。成分は黒板用と違い、ケイ酸塩系の専用品。',
    relatedSectionId: 'sports',
  },
  {
    id: 'tailors-chalk', name: 'テーラーズチャコ', emoji: '🧵', rarity: 2, category: 'sports',
    front: '裁縫で布に印をつけるチョーク。',
    back: '今はロウ（ワックス）系が多い。当て紙＋低温アイロンでロウを紙に転写すると、布をいためずに消せる。',
    relatedSectionId: 'sports',
  },

  // ── 健康・掃除 ──
  {
    id: 'dust', name: '舞い散る粉', emoji: '🧹', rarity: 1, category: 'health',
    front: 'チョークの粉がいちばん舞うのは「消すとき」。',
    back: '黒板消しをたたくと粉が一気に空中へ。たたかず吸い取る・換気する・湿らせて捨てる、で舞う粉をぐっと減らせる。',
    relatedSectionId: 'health',
  },

  // ── 比較 ──
  {
    id: 'blackboard', name: '黒板 vs ホワイトボード', emoji: '⚖️', rarity: 1, category: 'compare',
    front: 'どっちが上ではなく、場面で選ぶのが正解。',
    back: '黒板＋チョークは大きく安く力加減で表現でき、塗り直しで何十年も使える。ホワイトボードは粉なしで消しやすいがインク補充が要る。',
    relatedSectionId: 'whiteboard',
  },
];

export const TOTAL_CARDS = CHALK_CARDS.length;

export function cardsForSection(sectionId: string): ChalkCard[] {
  return CHALK_CARDS.filter((c) => c.relatedSectionId === sectionId);
}

export function getCard(id: string): ChalkCard | undefined {
  return CHALK_CARDS.find((c) => c.id === id);
}
