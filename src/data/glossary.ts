export type GlossaryEntry = {
  term: string;
  reading?: string;
  description: string;
  relatedSectionId?: string;
};

export const glossary: GlossaryEntry[] = [
  {
    term: '白墨',
    reading: 'はくぼく',
    description: '黒板用チョークの日本語名。学校でおなじみの白いチョークを指し、主成分のちがいで炭酸カルシウム製と石膏製に大別されます。',
    relatedSectionId: 'basics',
  },
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
    term: '焼き石膏',
    reading: 'やきせっこう',
    description: '石膏を加熱して水分を飛ばしたもの。水を混ぜると水和反応でふたたび硬い石膏に固まり、一度固まると元の粉には戻りません。石膏チョークや手作りチョークキットの材料です。',
    relatedSectionId: 'making',
  },
  {
    term: '顔料',
    reading: 'がんりょう',
    description: '色のもとになる粉。白い土台に顔料を混ぜることで、赤・青・黄・緑などの色チョークが作られます。発色を強めた蛍光チョークは、顔料を多めに配合しています。',
    relatedSectionId: 'types',
  },
  {
    term: 'ダストレスチョーク',
    description: '粉が舞い散りにくいように作られたチョーク。比重の大きい炭酸カルシウムを高密度に固め、消したときに粉が垂直に落ちやすくしています。',
    relatedSectionId: 'types',
  },
  {
    term: 'カラーユニバーサルデザイン（CUD）',
    description: '色の見え方の個人差に配慮し、多くの人に伝わりやすい配色を選ぶ考え方。CUD認証を受けたチョークもあり、大切な情報は色だけでなく下線や囲みも添えるとより伝わります。',
    relatedSectionId: 'types',
  },
  {
    term: 'ホーロー',
    reading: 'ほうろう',
    description: '金属の表面にガラス質の釉薬（ゆうやく）を高温で焼き付けた素材。耐久性・耐摩耗性にすぐれ、学校用黒板の表面材として広く使われています。黒板が長持ちする理由のひとつです。',
    relatedSectionId: 'whiteboard',
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
    term: 'コッコリス',
    description: '円石藻が身にまとう、炭酸カルシウムでできた小さな殻。大きさは髪の毛の太さの10分の1ほどしかなく、これが海底に積もり固まって白亜の地層になりました。',
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
  {
    term: '学校環境衛生基準',
    reading: 'がっこうかんきょうえいせいきじゅん',
    description: '学校の教室などの環境について文部科学省が定める基準。10マイクロメートル以下の細かい浮遊粉じんを、1立方メートルあたり0.10mg以下に保つよう求めています。',
    relatedSectionId: 'health',
  },
  {
    term: '特定原材料等28品目',
    reading: 'とくていげんざいりょうとう28ひんもく',
    description: '食物アレルギーの原因になりやすく、食品表示が義務づけ・推奨されている28品目（卵・乳・小麦・そば・落花生・えび・かに・くるみ など）。これらを含まずに作られたチョークもあります。',
    relatedSectionId: 'health',
  },
];
