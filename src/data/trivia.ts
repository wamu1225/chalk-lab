// ホームの「きょうのチョーク豆知識」。各記事の確認できる事実から短い一言を抜粋。
// 日替わりで切り替え、該当記事へ誘導する。

export type Trivia = { text: string; sectionId: string };

export const TRIVIA: Trivia[] = [
  { text: '「チョーク」はもともと白い岩「白亜（はくあ）」の名前。英語の chalk がそのまま白亜を指します。', sectionId: 'geology' },
  { text: 'クライミングで手にぬる白い粉は、すべり止めではなく「手の汗を吸ってサラサラに保つ」ためのものです。', sectionId: 'sports' },
  { text: '伝説の羽衣チョークは、廃業後に製法が韓国へ受け継がれ、今も同等品質で作られています。', sectionId: 'hagoromo' },
  { text: '白い崖をつくった円石藻の殻は、髪の毛の太さの約10分の1ほどしかありません。', sectionId: 'geology' },
  { text: 'チョークの粉がいちばん舞うのは、書くときより「消すとき」。たたかず吸い取るのがコツ。', sectionId: 'health' },
  { text: '「ダストレスチョーク」は粉ゼロではなく「粉が舞い散りにくい」という意味です。', sectionId: 'types' },
  { text: '捨てられるホタテの貝殻が、エコなチョークに生まれ変わっています。', sectionId: 'making' },
  { text: 'ビリヤードの「チョーク」は黒板用とは別物。キュー先の革に摩擦をつける専用品です。', sectionId: 'sports' },
  { text: '恐竜時代「白亜紀（Cretaceous）」の語源は、ラテン語でチョークを意味する creta。', sectionId: 'geology' },
  { text: '黒板は表面がすり減っても塗り直せて、何十年も使い続けられます。', sectionId: 'whiteboard' },
  { text: 'チョークが黒板に残るのは、けずれた粉が表面の細かなデコボコにひっかかるから。', sectionId: 'basics' },
  { text: '石膏チョークは、焼き石膏に水を混ぜると化学反応で固まり、もう元の粉には戻りません。', sectionId: 'making' },
];

export function todaysTrivia(): Trivia {
  const d = new Date();
  const key = d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate();
  return TRIVIA[key % TRIVIA.length];
}
