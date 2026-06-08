export type QuizQuestion = {
  q: string;
  choices: string[];
  answer: number; // index of correct choice
  explain: string;
  relatedSectionId?: string;
  relatedCardId?: string; // 正解するとこの図鑑カードの習熟度が上がる
};

// チョーク検定。内容は本文（確認できる事実）に対応。
export const QUIZ: QuizQuestion[] = [
  {
    q: 'チョークが黒板に文字を残せるのは、なぜ？',
    choices: ['磁石でくっつくから', '摩擦で削れた粉が黒板のデコボコにひっかかるから', 'インクがしみ込むから', '静電気で吸い付くから'],
    answer: 1,
    explain: 'チョークは摩擦で削れ、その粉が黒板表面の細かいデコボコにひっかかって残ります。鉛筆が紙の繊維に黒鉛をのせるのと似た原理です。',
    relatedSectionId: 'basics',
    relatedCardId: 'white-chalk',
  },
  {
    q: '今の学校で主流の「ダストレスチョーク」の主成分は？',
    choices: ['炭酸カルシウム', 'プラスチック', '塩', '鉄'],
    answer: 0,
    explain: '炭酸カルシウムを高密度に固めることで折れにくく、消したときに粉が垂直に落ちて散らかりにくくなっています。',
    relatedSectionId: 'basics',
    relatedCardId: 'dustless',
  },
  {
    q: '恐竜時代「白亜紀」の由来「白亜」を英語で言うと？',
    choices: ['ストーン', 'チョーク（chalk）', 'ロック', 'ホワイト'],
    answer: 1,
    explain: '英語 chalk はもともと白い岩「白亜」の名前。ラテン語の creta（チョーク）が白亜紀（Cretaceous）の語源です。',
    relatedSectionId: 'geology',
    relatedCardId: 'chalk-rock',
  },
  {
    q: '白亜（白い崖）をつくったのは、何の生き物？',
    choices: ['サンゴ', 'クジラ', '円石藻という小さなプランクトン', '貝'],
    answer: 2,
    explain: '円石藻の炭酸カルシウムの殻（コッコリス）が海底に積もり、押し固められて白亜の地層になりました。',
    relatedSectionId: 'geology',
    relatedCardId: 'coccolith',
  },
  {
    q: '「チョーク界のロールスロイス」と呼ばれた日本の名品チョークは？',
    choices: ['羽衣（ハゴロモ）チョーク', '富士チョーク', '桜チョーク', '大和チョーク'],
    answer: 0,
    explain: 'なめらかな書き味・折れにくさ・手が汚れにくさで世界の数学者に愛されました。',
    relatedSectionId: 'hagoromo',
    relatedCardId: 'hagoromo',
  },
  {
    q: '羽衣チョークの製法は、廃業後どこに受け継がれた？',
    choices: ['アメリカ', '中国', '韓国', 'ドイツ'],
    answer: 2,
    explain: '愛用者だった人物が機械・技術・商標をゆずり受け、韓国の会社で生産が続けられています。',
    relatedSectionId: 'hagoromo',
    relatedCardId: 'hagoromo',
  },
  {
    q: 'クライミングで手にぬる白い粉。本当の役割は？',
    choices: ['手をザラザラさせる', '手の汗を吸ってサラサラに保つ', '岩をやわらかくする', '手をあたためる'],
    answer: 1,
    explain: '主成分の炭酸マグネシウムは吸水性が高く、汗を吸って手を乾かします。摩擦を増やすのではなく「汗によるすべり」を取りのぞくのが目的です。',
    relatedSectionId: 'sports',
    relatedCardId: 'climbing',
  },
  {
    q: 'ビリヤードで使う「チョーク」の役割は？',
    choices: ['球を光らせる', 'キュー先の革に摩擦をつけてすべりを防ぐ', '球を重くする', '台をきれいにする'],
    answer: 1,
    explain: 'キュー先と球がすべらないよう摩擦をつけます。成分は黒板用とは違う専用品です。',
    relatedSectionId: 'sports',
    relatedCardId: 'billiard',
  },
  {
    q: '捨てられていた「あるもの」を再利用したエコなチョークがあります。それは？',
    choices: ['ペットボトル', 'ホタテの貝殻', '古い新聞紙', '木のえだ'],
    answer: 1,
    explain: 'ホタテ貝殻は高純度の炭酸カルシウム。細かく砕いて配合することで、資源の循環につなげています（卵殻を使うものもあります）。',
    relatedSectionId: 'making',
    relatedCardId: 'scallop',
  },
  {
    q: 'チョークの粉がいちばん多く舞うのは、どのとき？',
    choices: ['書いているとき', '黒板消しで消すとき・たたくとき', 'しまっているとき', '箱を開けるとき'],
    answer: 1,
    explain: '粉は書くときより「消すとき」に多く出ます。たたかず吸い取る・換気する・湿らせて捨てる、で舞う粉を減らせます。',
    relatedSectionId: 'health',
    relatedCardId: 'dust',
  },
];

export const QUIZ_PASS = 8; // 合格ライン（/10）
