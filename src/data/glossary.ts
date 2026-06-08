export type GlossaryEntry = {
  term: string;
  reading?: string;
  description: string;
  relatedSectionId?: string;
};

export const glossary: GlossaryEntry[] = [
  {
    term: '炭酸カルシウム',
    reading: 'たんさんカルシウム',
    description: '石灰石や貝殻、卵殻などの主成分。チョークの主要な材料のひとつで、粒が詰まって折れにくく、粉が散りにくい「ダストレスチョーク」に使われます。',
    relatedSectionId: 'basics',
  },
  {
    term: '石膏',
    reading: 'せっこう',
    description: '硫酸カルシウムからなる鉱物。加熱した「焼き石膏」に水を混ぜると化学反応で固まります。やわらかく太字を書きやすい一方、粉が舞いやすい性質があります。',
    relatedSectionId: 'making',
  },
  {
    term: 'ダストレスチョーク',
    description: '粉が舞い散りにくいように作られたチョーク。比重の大きい炭酸カルシウムを高密度に固め、消したときに粉が垂直に落ちやすくしています。',
    relatedSectionId: 'types',
  },
  {
    term: '白亜',
    reading: 'はくあ',
    description: '白くてやわらかい石灰岩の一種で、英語では chalk。昔の黒板チョークはこれを削って作られました。円石藻の殻が積もってできた岩です。',
    relatedSectionId: 'geology',
  },
  {
    term: '円石藻',
    reading: 'えんせきそう',
    description: '海にすむ小さな植物プランクトン。炭酸カルシウムの殻（コッコリス）を持ち、これが海底に積もって白亜の地層を作りました。',
    relatedSectionId: 'geology',
  },
  {
    term: '白亜紀',
    reading: 'はくあき',
    description: '恐竜が栄えた地質時代のひとつ。英語 Cretaceous はラテン語でチョークを意味する creta が語源で、この時代に白亜の地層が大量に作られたことに由来します。',
    relatedSectionId: 'geology',
  },
  {
    term: '羽衣チョーク',
    reading: 'はごろもチョーク',
    description: 'かつて日本で作られ「チョーク界のロールスロイス」と呼ばれた名品。なめらかな書き味で世界の数学者に愛され、廃業後は製法が韓国に受け継がれました。',
    relatedSectionId: 'hagoromo',
  },
  {
    term: '炭酸マグネシウム',
    reading: 'たんさんマグネシウム',
    description: 'クライミングや体操で使う白い粉の主成分。吸水性が高く、手の汗を吸ってサラサラに保つことですべりを防ぎます。',
    relatedSectionId: 'sports',
  },
  {
    term: 'テーラーズチョーク',
    description: '裁縫で布に印をつける道具（チャコ）。現在はロウ（ワックス）系が多く、当て紙＋低温アイロンで布をいためずに消せます。',
    relatedSectionId: 'sports',
  },
];
