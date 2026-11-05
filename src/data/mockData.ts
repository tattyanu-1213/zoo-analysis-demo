import type { CongestionCell, Participant } from "../types";
import { ZONES } from "./zones";
import { buildRoute } from "./routeBuilder";

const participantA: Participant = {
  id: "A",
  name: "たかし",
  age: 22,
  affiliation: "大学生",
  color: "#e4572e",
  weather: "晴れ",
  visitDate: "2026-10-18",
  expectationText: "虎をじっくり見たい。迫力のある瞬間を見られたら嬉しい。",
  expectationTags: ["動物"],
  drawingBeforeLabel: "絵(対話前)_たかし",
  drawingAfterLabel: "絵(対話後)_たかし",
  route: buildRoute(
    [
      { point: ZONES.entrance },
      { point: ZONES.penguin, dwellSec: 180 },
      { point: ZONES.savanna, dwellSec: 60 },
      { point: ZONES.ratites, dwellSec: 30 },
      { point: ZONES.reptile, dwellSec: 240 },
      { point: ZONES.smallAnimal, dwellSec: 60 },
      { point: ZONES.felidae, dwellSec: 300 },
      { point: ZONES.elephant, dwellSec: 90 },
      { point: ZONES.monkey, dwellSec: 150 },
      { point: ZONES.entrance },
    ],
    1
  ),
  photos: [
    { id: "A1", participantId: "A", t: 60, tag: "動物", label: "画像1", caption: "ペンギンが泳ぐ瞬間", hasExifLocation: true, x: ZONES.penguin.x + 0.6, y: ZONES.penguin.y - 0.4 },
    { id: "A2", participantId: "A", t: 150, tag: "風景", label: "画像2", caption: "池の反射", hasExifLocation: true, x: ZONES.penguin.x - 0.8, y: ZONES.penguin.y + 0.5 },
    { id: "A3", participantId: "A", t: 420, tag: "動物", label: "画像3", caption: "キリンの横顔", hasExifLocation: true, x: ZONES.savanna.x + 0.3, y: ZONES.savanna.y - 0.6 },
    { id: "A4", participantId: "A", t: 760, tag: "動物", label: "画像4", caption: "カメの甲羅", hasExifLocation: true, x: ZONES.reptile.x + 0.4, y: ZONES.reptile.y + 0.3 },
    { id: "A5", participantId: "A", t: 1250, tag: "動物", label: "画像5", caption: "虎が伸びをする瞬間", hasExifLocation: true, x: ZONES.felidae.x + 0.5, y: ZONES.felidae.y - 0.3 },
    { id: "A6", participantId: "A", t: 1300, tag: "動物", label: "画像6", caption: "虎のあくび", hasExifLocation: true, x: ZONES.felidae.x - 0.4, y: ZONES.felidae.y + 0.4 },
    { id: "A7", participantId: "A", t: 1400, tag: "風景", label: "画像7", caption: "木漏れ日の通路", hasExifLocation: false, x: ZONES.felidae.x + 1.0, y: ZONES.felidae.y + 1.2 },
    { id: "A8", participantId: "A", t: 1680, tag: "人物", label: "画像8", caption: "友達が猿を指差す様子", hasExifLocation: true, x: ZONES.monkey.x - 0.5, y: ZONES.monkey.y + 0.4 },
    { id: "A9", participantId: "A", t: 1750, tag: "動物", label: "画像9", caption: "サル山全体", hasExifLocation: true, x: ZONES.monkey.x + 0.6, y: ZONES.monkey.y - 0.5 },
  ],
  drawingHighlights: [
    { x: ZONES.felidae.x, y: ZONES.felidae.y, label: "虎が伸びをしている場面", note: "一番大きく、色も濃く描かれていた" },
    { x: ZONES.monkey.x, y: ZONES.monkey.y, label: "友達とサル山で話す様子", note: "人物が描かれている唯一の場面" },
  ],
  interview: [
    { x: ZONES.felidae.x, y: ZONES.felidae.y, question: "なぜこの場面が心に残りましたか?", answer: "思ったより近くで、虎が伸びをする瞬間が見られて迫力があった。" },
    { x: ZONES.monkey.x, y: ZONES.monkey.y, question: "ここでは何をしていましたか?", answer: "友達とどのサルが一番強そうか話してた。" },
  ],
};

const participantB: Participant = {
  id: "B",
  name: "ゆい",
  age: 19,
  affiliation: "高校生",
  color: "#2176ae",
  weather: "雨",
  visitDate: "2026-10-25",
  expectationText: "インスタ映えする写真が撮りたい。象さんが見たい。",
  expectationTags: ["動物", "風景"],
  drawingBeforeLabel: "絵(対話前)_ゆい",
  drawingAfterLabel: "絵(対話後)_ゆい",
  route: buildRoute(
    [
      { point: ZONES.entrance },
      { point: ZONES.penguin, dwellSec: 60 },
      { point: ZONES.monkey, dwellSec: 60 },
      { point: ZONES.elephant, dwellSec: 180 },
      { point: ZONES.felidae, dwellSec: 60 },
      { point: ZONES.stage, dwellSec: 300 },
      { point: ZONES.reptile, dwellSec: 200 },
      { point: ZONES.smallAnimal, dwellSec: 90 },
      { point: ZONES.savanna, dwellSec: 45 },
      { point: ZONES.entrance },
    ],
    2
  ),
  photos: [
    { id: "B1", participantId: "B", t: 50, tag: "動物", label: "画像10", caption: "ペンギンの群れ", hasExifLocation: true, x: ZONES.penguin.x - 0.3, y: ZONES.penguin.y + 0.5 },
    { id: "B2", participantId: "B", t: 560, tag: "動物", label: "画像11", caption: "ゾウが鼻を伸ばす瞬間", hasExifLocation: true, x: ZONES.elephant.x + 0.4, y: ZONES.elephant.y - 0.3 },
    { id: "B3", participantId: "B", t: 650, tag: "風景", label: "画像12", caption: "雨に濡れた展示場", hasExifLocation: true, x: ZONES.elephant.x - 0.5, y: ZONES.elephant.y + 0.6 },
    { id: "B4", participantId: "B", t: 1100, tag: "人物", label: "画像13", caption: "友達と雨宿り", hasExifLocation: true, x: ZONES.stage.x + 0.3, y: ZONES.stage.y - 0.2 },
    { id: "B5", participantId: "B", t: 1500, tag: "動物", label: "画像14", caption: "ヘビのアップ", hasExifLocation: true, x: ZONES.reptile.x - 0.4, y: ZONES.reptile.y + 0.3 },
  ],
  drawingHighlights: [
    { x: ZONES.stage.x, y: ZONES.stage.y, label: "雨宿りしながらお菓子を食べている場面", note: "傘や屋根が大きく描かれている" },
    { x: ZONES.elephant.x, y: ZONES.elephant.y, label: "ゾウが鼻を伸ばす場面", note: "色鉛筆で一番時間をかけて描いていた" },
  ],
  interview: [
    { x: ZONES.stage.x, y: ZONES.stage.y, question: "なぜこの場面が心に残りましたか?", answer: "急に雨が降ってきて、みんなで屋根の下に避難したのが逆に楽しかった。" },
    { x: ZONES.elephant.x, y: ZONES.elephant.y, question: "気になる場所はありますか?", answer: "象が鼻を伸ばして葉っぱを取る瞬間が可愛かった。" },
  ],
};

const participantC: Participant = {
  id: "C",
  name: "けんた",
  age: 24,
  affiliation: "大学院生",
  color: "#2a9d8f",
  weather: "曇り",
  visitDate: "2026-11-01",
  expectationText: "のんびり自然の中で過ごしたい。写真が趣味なので良い構図を探したい。",
  expectationTags: ["風景", "動物"],
  drawingBeforeLabel: "絵(対話前)_けんた",
  drawingAfterLabel: "絵(対話後)_けんた",
  route: buildRoute(
    [
      { point: ZONES.entrance },
      { point: ZONES.savanna, dwellSec: 90 },
      { point: ZONES.ratites, dwellSec: 30 },
      { point: ZONES.flyingCage, dwellSec: 120 },
      { point: ZONES.grassland2, dwellSec: 200 },
      { point: ZONES.smallAnimal, dwellSec: 60 },
      { point: ZONES.reptile, dwellSec: 60 },
      { point: ZONES.stage, dwellSec: 30 },
      { point: ZONES.felidae, dwellSec: 90 },
      { point: ZONES.elephant, dwellSec: 60 },
      { point: ZONES.penguin, dwellSec: 150 },
      { point: ZONES.entrance },
    ],
    3
  ),
  photos: [
    { id: "C1", participantId: "C", t: 420, tag: "動物", label: "画像15", caption: "鳥が飛ぶ瞬間", hasExifLocation: true, x: ZONES.flyingCage.x + 0.4, y: ZONES.flyingCage.y - 0.3 },
    { id: "C2", participantId: "C", t: 720, tag: "風景", label: "画像16", caption: "芝生に寝転んで見た空", hasExifLocation: true, x: ZONES.grassland2.x - 0.3, y: ZONES.grassland2.y - 0.4 },
    { id: "C3", participantId: "C", t: 800, tag: "風景", label: "画像17", caption: "木漏れ日と芝生", hasExifLocation: false, x: ZONES.grassland2.x + 0.5, y: ZONES.grassland2.y + 0.3 },
    { id: "C4", participantId: "C", t: 1700, tag: "動物", label: "画像18", caption: "ペンギンの群れ(夕方)", hasExifLocation: true, x: ZONES.penguin.x + 0.3, y: ZONES.penguin.y + 0.4 },
    { id: "C5", participantId: "C", t: 1760, tag: "人物", label: "画像19", caption: "ペンギン前で自撮り", hasExifLocation: true, x: ZONES.penguin.x - 0.6, y: ZONES.penguin.y - 0.5 },
  ],
  drawingHighlights: [
    { x: ZONES.grassland2.x, y: ZONES.grassland2.y, label: "寝転んで見た空と木", note: "空の青を一番濃く塗っていた" },
    { x: ZONES.penguin.x, y: ZONES.penguin.y, label: "夕方のペンギンの群れ", note: "最後に描き足された場面" },
  ],
  interview: [
    { x: ZONES.grassland2.x, y: ZONES.grassland2.y, question: "これはどんな場面ですか?", answer: "歩き疲れたので寝転んで空を見てた。風が気持ちよかった。" },
    { x: ZONES.penguin.x, y: ZONES.penguin.y, question: "なぜこの場面が心に残りましたか?", answer: "最後に見たペンギンの群れが夕方の光で綺麗だった。" },
  ],
};

export const PARTICIPANTS: Participant[] = [participantA, participantB, participantC];

// 混雑度の仮データ(時間帯別・エリア別)
export const CONGESTION_CELLS: CongestionCell[] = [
  { x: ZONES.penguin.x, y: ZONES.penguin.y, radius: 5, level: 0.7, timeRange: "10:00-12:00" },
  { x: ZONES.savanna.x, y: ZONES.savanna.y, radius: 6, level: 0.4, timeRange: "10:00-12:00" },
  { x: ZONES.felidae.x, y: ZONES.felidae.y, radius: 5, level: 0.8, timeRange: "13:00-15:00" },
  { x: ZONES.monkey.x, y: ZONES.monkey.y, radius: 4, level: 0.5, timeRange: "13:00-15:00" },
  { x: ZONES.stage.x, y: ZONES.stage.y, radius: 5, level: 0.3, timeRange: "10:00-12:00" },
  { x: ZONES.elephant.x, y: ZONES.elephant.y, radius: 5, level: 0.6, timeRange: "13:00-15:00" },
  { x: ZONES.reptile.x, y: ZONES.reptile.y, radius: 4, level: 0.5, timeRange: "13:00-15:00" },
];
