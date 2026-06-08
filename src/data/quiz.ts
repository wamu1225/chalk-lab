export type QuizQuestion = {
  q: string;
  choices: string[];
  answer: number; // index of correct choice
  explain: string;
  difficulty: 1 | 2 | 3; // ★の数
  relatedSectionId?: string;
  relatedCardId?: string; // 正解するとこの図鑑カードの習熟度が上がる
};

// 1回の検定で出題する問題数と合格ライン
export const QUIZ_PER_PLAY = 10;
export const QUIZ_PASS = 8;

// チョーク検定の問題バンク（毎回この中からランダムに QUIZ_PER_PLAY 問を出題）。
// 内容は本文（確認できる事実）に対応。
export const QUIZ: QuizQuestion[] = [
  {
    q: 'チョークが黒板に文字を残せるのは、なぜ？',
    choices: ['磁石でくっつくから', '摩擦で削れた粉が黒板のデコボコにひっかかるから', 'インクがしみ込むから', '静電気で吸い付くから'],
    answer: 1, difficulty: 1,
    explain: 'チョークは摩擦で削れ、その粉が黒板表面の細かいデコボコにひっかかって残ります。鉛筆が紙の繊維に黒鉛をのせるのと似た原理です。',
    relatedSectionId: 'basics', relatedCardId: 'white-chalk',
  },
  {
    q: '今の学校で主流の「ダストレスチョーク」の主成分は？',
    choices: ['炭酸カルシウム', 'プラスチック', '塩', '鉄'],
    answer: 0, difficulty: 1,
    explain: '炭酸カルシウムを高密度に固めることで折れにくく、消したときに粉が垂直に落ちて散らかりにくくなっています。',
    relatedSectionId: 'basics', relatedCardId: 'dustless',
  },
  {
    q: '恐竜時代「白亜紀」の由来「白亜」を英語で言うと？',
    choices: ['ストーン', 'チョーク（chalk）', 'ロック', 'ホワイト'],
    answer: 1, difficulty: 2,
    explain: '英語 chalk はもともと白い岩「白亜」の名前。ラテン語の creta（チョーク）が白亜紀（Cretaceous）の語源です。',
    relatedSectionId: 'geology', relatedCardId: 'chalk-rock',
  },
  {
    q: '白亜（白い崖）をつくったのは、何の生き物？',
    choices: ['サンゴ', 'クジラ', '円石藻という小さなプランクトン', '貝'],
    answer: 2, difficulty: 2,
    explain: '円石藻の炭酸カルシウムの殻（コッコリス）が海底に積もり、押し固められて白亜の地層になりました。',
    relatedSectionId: 'geology', relatedCardId: 'coccolith',
  },
  {
    q: '「チョーク界のロールスロイス」と呼ばれた日本の名品チョークは？',
    choices: ['羽衣（ハゴロモ）チョーク', '富士チョーク', '桜チョーク', '大和チョーク'],
    answer: 0, difficulty: 1,
    explain: 'なめらかな書き味・折れにくさ・手が汚れにくさで世界の数学者に愛されました。',
    relatedSectionId: 'hagoromo', relatedCardId: 'hagoromo',
  },
  {
    q: '羽衣チョークの製法は、廃業後どこに受け継がれた？',
    choices: ['アメリカ', '中国', '韓国', 'ドイツ'],
    answer: 2, difficulty: 2,
    explain: '愛用者だった人物が機械・技術・商標をゆずり受け、韓国の会社で生産が続けられています。',
    relatedSectionId: 'hagoromo', relatedCardId: 'hagoromo',
  },
  {
    q: 'クライミングで手にぬる白い粉。本当の役割は？',
    choices: ['手をザラザラさせる', '手の汗を吸ってサラサラに保つ', '岩をやわらかくする', '手をあたためる'],
    answer: 1, difficulty: 2,
    explain: '主成分の炭酸マグネシウムは吸水性が高く、汗を吸って手を乾かします。摩擦を増やすのではなく「汗によるすべり」を取りのぞくのが目的です。',
    relatedSectionId: 'sports', relatedCardId: 'climbing',
  },
  {
    q: 'ビリヤードで使う「チョーク」の役割は？',
    choices: ['球を光らせる', 'キュー先の革に摩擦をつけてすべりを防ぐ', '球を重くする', '台をきれいにする'],
    answer: 1, difficulty: 2,
    explain: 'キュー先と球がすべらないよう摩擦をつけます。成分は黒板用とは違う専用品です。',
    relatedSectionId: 'sports', relatedCardId: 'billiard',
  },
  {
    q: '捨てられていた「あるもの」を再利用したエコなチョークがあります。それは？',
    choices: ['ペットボトル', 'ホタテの貝殻', '古い新聞紙', '木のえだ'],
    answer: 1, difficulty: 1,
    explain: 'ホタテ貝殻は高純度の炭酸カルシウム。細かく砕いて配合することで、資源の循環につなげています（卵殻を使うものもあります）。',
    relatedSectionId: 'making', relatedCardId: 'scallop',
  },
  {
    q: 'チョークの粉がいちばん多く舞うのは、どのとき？',
    choices: ['書いているとき', '黒板消しで消すとき・たたくとき', 'しまっているとき', '箱を開けるとき'],
    answer: 1, difficulty: 1,
    explain: '粉は書くときより「消すとき」に多く出ます。たたかず吸い取る・換気する・湿らせて捨てる、で舞う粉を減らせます。',
    relatedSectionId: 'health', relatedCardId: 'dust',
  },
  {
    q: '石膏チョークは「焼き石膏」に何を混ぜると固まる？',
    choices: ['水', '油', 'お酢', '砂糖'],
    answer: 0, difficulty: 2,
    explain: '焼き石膏に水を混ぜると水和反応で固まります。一度固まると元の粉には戻りません（不可逆）。',
    relatedSectionId: 'making', relatedCardId: 'gypsum',
  },
  {
    q: '日本の学校用チョークの長さは、標準的におよそどれくらい？',
    choices: ['約2cm', '約6.5cm', '約15cm', '約30cm'],
    answer: 1, difficulty: 2,
    explain: '学校用は長さ約6.5cmの棒が標準的なサイズとして広く使われています。',
    relatedSectionId: 'types', relatedCardId: 'dustless',
  },
  {
    q: '黒板がホワイトボードに対して持つ、長く使える利点は？',
    choices: ['電気で光る', '表面がすり減っても塗り直して何十年も使える', '折りたためる', '水に浮く'],
    answer: 1, difficulty: 2,
    explain: '黒板は表面がすり減っても再塗装でよみがえり、何十年も使い続けられます。ホワイトボードは表面が傷むと消えにくくなります。',
    relatedSectionId: 'whiteboard', relatedCardId: 'blackboard',
  },
  {
    q: '円石藻の殻（コッコリス）の大きさは、どれくらい小さい？',
    choices: ['髪の毛の太さの約10分の1', 'ゴマつぶくらい', '米つぶくらい', '1cmくらい'],
    answer: 0, difficulty: 3,
    explain: '殻はおおよそ髪の毛の太さの10分の1ほど。その小さな殻が積もって、あの巨大な白い崖を作りました。',
    relatedSectionId: 'geology', relatedCardId: 'coccolith',
  },
  {
    q: '裁縫用のチャコ（ロウ系）の線を、布をいためず消す方法は？',
    choices: ['水でゴシゴシこする', '当て紙をして低温アイロンを当てる', '冷凍庫で冷やす', '日なたに干す'],
    answer: 1, difficulty: 3,
    explain: '当て紙をして低い温度のアイロンを当てると、熱でロウがとけて紙にうつり、布をいためずに消せます。',
    relatedSectionId: 'sports', relatedCardId: 'tailors-chalk',
  },
  {
    q: '羽衣チョークが「手が汚れにくい」とされた理由は？',
    choices: ['表面に薄いワックス（ロウ）の膜がある', '中が空どう', '水をはじく金属製', '静電気を出す'],
    answer: 0, difficulty: 2,
    explain: '表面の薄いワックスの膜のおかげで、長時間書いても指に白い粉がつきにくいのが特徴でした。',
    relatedSectionId: 'hagoromo', relatedCardId: 'hagoromo',
  },
  {
    q: '2015年の羽衣文具 廃業時、世界の数学界で起きた騒動の通称は？',
    choices: ['チョークラッシュ', 'Chalkapocalypse（チョーク黙示録）', 'ホワイトアウト', 'チョークショック'],
    answer: 1, difficulty: 3,
    explain: '研究者たちが退職までに必要な本数を計算し、10〜15年分を一気に買い集めたことから、こう呼ばれました。',
    relatedSectionId: 'hagoromo', relatedCardId: 'hagoromo',
  },
  {
    q: 'ホタテ貝殻を再生チョークに混ぜる割合は、およそどれくらい？',
    choices: ['全体の約1割', '全体の約8割', 'ほぼ100%', '0.01%'],
    answer: 0, difficulty: 3,
    explain: '混ぜすぎると硬くなりすぎて黒板を傷つけるため、約1割の配合で折れにくさと書き味を両立させています。',
    relatedSectionId: 'making', relatedCardId: 'scallop',
  },
  {
    q: '色チョークの「色」は、何でつけている？',
    choices: ['顔料（色のもとの粉）', '食べ物の色', '光るペンキ', '色のついた水'],
    answer: 0, difficulty: 1,
    explain: '白い土台に顔料（色のもとになる粉）を混ぜて、赤・青・黄・緑などの色チョークを作ります。',
    relatedSectionId: 'types', relatedCardId: 'color-chalk',
  },
  {
    q: '多くの人に色が伝わるよう配色を工夫したチョークについている認証は？',
    choices: ['ISO', 'カラーユニバーサルデザイン（CUD）', 'JIS-A', 'グッドデザイン'],
    answer: 1, difficulty: 3,
    explain: '色の見え方の個人差に配慮し、多くの人に伝わりやすい配色を選んだチョークにはCUD認証マークが付いているものがあります。',
    relatedSectionId: 'types', relatedCardId: 'luminous',
  },
  {
    q: 'ビリヤードのチョークをこすりつけるのは、どこ？',
    choices: ['球の表面', 'キュー先の革（タップ）', '台のふち', '自分の手'],
    answer: 1, difficulty: 2,
    explain: 'キュー先の革にこすりつけて、球を突く瞬間にすべらないよう摩擦をつけます。',
    relatedSectionId: 'sports', relatedCardId: 'billiard',
  },
  {
    q: '白亜紀の英名 Cretaceous の語源「creta」（ラテン語）の意味は？',
    choices: ['恐竜', 'チョーク（白亜）', '海', '時代'],
    answer: 1, difficulty: 3,
    explain: 'この時代に円石藻が大量に増えて分厚い白亜の地層を作ったため、「チョークの時代」という意味の名がつきました。',
    relatedSectionId: 'geology', relatedCardId: 'cretaceous',
  },
  {
    q: 'チョークがガラスや金属につきにくいのは、なぜ？',
    choices: ['つるつるで粉がひっかかりにくいから', '冷たいから', '電気を通すから', '重いから'],
    answer: 0, difficulty: 2,
    explain: 'チョークは削れた粉が相手のデコボコにひっかかって残ります。つるつるの面はひっかかりが少なく定着しにくいのです。',
    relatedSectionId: 'basics', relatedCardId: 'white-chalk',
  },
  {
    q: 'ホワイトボードの弱点として正しいのは？',
    choices: ['粉がたくさん出る', 'マーカーのインク補充・交換が必要', '水で消えない', '色が一切使えない'],
    answer: 1, difficulty: 1,
    explain: 'ホワイトボードは粉が出ず消しやすい一方、マーカーのインクが乾いたり補充・交換が必要になります。',
    relatedSectionId: 'whiteboard', relatedCardId: 'blackboard',
  },
  {
    q: '炭酸カルシウム製チョークの作り方の流れとして正しいのは？',
    choices: ['混ぜる→押し出す→切る→乾かす', '焼く→ひやす→けずる', 'とかす→流す→こおらせる', 'ほる→みがく→ぬる'],
    answer: 0, difficulty: 2,
    explain: '材料を練って細い棒状に押し出し、決まった長さに切ってから熱でしっかり乾かします。',
    relatedSectionId: 'making', relatedCardId: 'making',
  },
  {
    q: '食物アレルギーに配慮し、原因になりうる原材料を含まないよう作られたチョークがあります。配慮の対象は何品目？',
    choices: ['3品目', '28品目', '100品目', '1品目'],
    answer: 1, difficulty: 3,
    explain: 'アレルギーの特定原材料等28品目を含まないように配慮して作られた製品があります（とはいえチョークは食べ物ではありません）。',
    relatedSectionId: 'health', relatedCardId: 'dust',
  },
  {
    q: '蛍光チョークが消えにくいとき、向いている黒板消しの生地は？',
    choices: ['ビニール', '別珍（ベロア）', '金あみ', '紙やすり'],
    answer: 1, difficulty: 3,
    explain: '蛍光チョークは顔料が多く消えにくいため、別珍（ベロア）生地の黒板消しが向いています。',
    relatedSectionId: 'types', relatedCardId: 'luminous',
  },
  {
    q: '廃業した羽衣チョークの製法を受け継いだ韓国の会社は？',
    choices: ['セジョンモール', 'サムスン', 'ヒュンダイ', 'ロッテ'],
    answer: 0, difficulty: 3,
    explain: '愛用者だった人物が韓国に設立した「セジョンモール」が製造設備と技術を引き継ぎ、生産を続けています。',
    relatedSectionId: 'hagoromo', relatedCardId: 'hagoromo',
  },
  {
    q: '白い崖（白亜の地層）で有名な、イギリスの海峡は？',
    choices: ['ジブラルタル海峡', 'ドーバー海峡', 'ベーリング海峡', 'マゼラン海峡'],
    answer: 1, difficulty: 2,
    explain: 'ドーバー海峡に面した「白い崖」は、すべて小さなプランクトンの殻が積もってできたものです。',
    relatedSectionId: 'geology', relatedCardId: 'chalk-rock',
  },
  {
    q: 'クライミング用チョークの主成分は？',
    choices: ['炭酸マグネシウム', '砂糖', '小麦粉', '塩'],
    answer: 0, difficulty: 2,
    explain: '炭酸マグネシウムは吸水性が高く、手の汗を吸ってサラサラに保ちます。',
    relatedSectionId: 'sports', relatedCardId: 'climbing',
  },
];

// 乱数：Math.random（通常）と、日替わりシード（今日の検定）で共用する
function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// 配列をシャッフル（破壊しない・rnd差し替え可）
function shuffleWith<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 1プレイ分：QUIZ_PER_PLAY 問選び、各問の選択肢もシャッフルして answer を貼り直す
function buildPlay(rnd: () => number): QuizQuestion[] {
  const picked = shuffleWith(QUIZ, rnd).slice(0, QUIZ_PER_PLAY);
  return picked.map((q) => {
    const order = shuffleWith(q.choices.map((_, i) => i), rnd);
    return {
      ...q,
      choices: order.map((i) => q.choices[i]),
      answer: order.indexOf(q.answer),
    };
  });
}

// 通常：毎回ランダム
export function buildQuizPlay(): QuizQuestion[] {
  return buildPlay(Math.random);
}

// 今日の検定：その日のキーをシードに、全員同じ出題・選択肢順
export function buildDailyPlay(dateKey: string): QuizQuestion[] {
  return buildPlay(mulberry32(hashStr(`chalk-daily-${dateKey}`)));
}

// ローカル日付の YYYY-MM-DD
export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
