// guidemap.jpg (1273x900) 上の主要ゾーンのおおよその位置(% 座標)。
// 実測ではなく目視で割り当てた仮の値。
export const ZONES = {
  entrance: { x: 58, y: 68, label: "入退場ゲート" },
  penguin: { x: 47, y: 43, label: "① ペンギンゾーン" },
  savanna: { x: 37, y: 54, label: "② サバンナゾーン(キリン・シマウマ)" },
  ratites: { x: 24, y: 50, label: "③ 走鳥類・ふれあい動物ゾーン" },
  flyingCage: { x: 18, y: 50, label: "④ フライングケージ" },
  reptile: { x: 24, y: 32, label: "⑤ は虫類館ゾーン" },
  smallAnimal: { x: 14, y: 30, label: "⑥ 小動物ゾーン" },
  felidae: { x: 17, y: 13, label: "⑦ 猛獣ゾーン" },
  elephant: { x: 32, y: 21, label: "⑧ ゾウゾーン" },
  monkey: { x: 50, y: 29, label: "⑨ サルゾーン" },
  stage: { x: 27, y: 34, label: "ステージ/芝生広場" },
  grassland2: { x: 19, y: 58, label: "芝生広場" },
  memorial: { x: 63, y: 35, label: "動物供養碑" },
  pond: { x: 32, y: 65, label: "富谷池" },
} as const;

export const SHADED_AREAS = [
  {
    id: "shade-reptile",
    label: "は虫類館(屋内・屋根あり)",
    points: [
      { x: 20, y: 27 },
      { x: 29, y: 27 },
      { x: 29, y: 36 },
      { x: 20, y: 36 },
    ],
  },
  {
    id: "shade-stage",
    label: "ステージ屋根",
    points: [
      { x: 24, y: 31 },
      { x: 31, y: 31 },
      { x: 31, y: 37 },
      { x: 24, y: 37 },
    ],
  },
  {
    id: "shade-entrance",
    label: "動物公園管理センター(屋根あり)",
    points: [
      { x: 55, y: 60 },
      { x: 65, y: 60 },
      { x: 65, y: 68 },
      { x: 55, y: 68 },
    ],
  },
];

export const LANDMARKS = [
  { id: "lm1", label: "ベンチ(ペンギン前)", x: 46, y: 40, kind: "ベンチ" as const },
  { id: "lm2", label: "ベンチ(サバンナ展望)", x: 39, y: 51, kind: "ベンチ" as const },
  { id: "lm3", label: "トイレ(は虫類館横)", x: 26, y: 30, kind: "トイレ" as const },
  { id: "lm4", label: "売店(芝生広場)", x: 29, y: 32, kind: "売店" as const },
  { id: "lm5", label: "ベンチ(サル山前)", x: 49, y: 26, kind: "ベンチ" as const },
  { id: "lm6", label: "日陰(猛獣ゾーン通路)", x: 19, y: 16, kind: "日陰" as const },
  { id: "lm7", label: "トイレ(芝生広場)", x: 15, y: 32, kind: "トイレ" as const },
];
