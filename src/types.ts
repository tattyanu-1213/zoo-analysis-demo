// 座標は guidemap.jpg 画像に対する相対位置 (0-100 の % )
export interface Point {
  x: number;
  y: number;
}

export interface GPSPoint extends Point {
  t: number; // 入園からの経過秒
}

export type PhotoTag = "動物" | "風景" | "人物" | "その他";

export interface Photo extends Point {
  id: string;
  participantId: string;
  t: number;
  tag: PhotoTag;
  label: string; // 「画像1」など仮のラベル
  caption: string;
  hasExifLocation: boolean; // false の場合は人力で場所を特定したもの
}

export interface StayPoint extends Point {
  startT: number;
  endT: number;
  duration: number; // 秒
  nearbyLandmarks: string[];
}

export interface DrawingHighlight extends Point {
  label: string;
  note: string; // 絵に描かれていた内容のメモ
}

export interface InterviewNote extends Point {
  question: string;
  answer: string;
}

export type Weather = "晴れ" | "雨" | "曇り";

export interface Participant {
  id: string;
  name: string;
  age: number;
  affiliation: string; // 高校生 / 大学生 など
  color: string;
  weather: Weather;
  visitDate: string;
  route: GPSPoint[];
  photos: Photo[];
  expectationText: string; // アンケート「今日の楽しみなこと」
  expectationTags: PhotoTag[];
  drawingHighlights: DrawingHighlight[];
  interview: InterviewNote[];
  drawingBeforeLabel: string;
  drawingAfterLabel: string;
}

export interface ShadedArea {
  id: string;
  label: string;
  points: Point[]; // polygon
}

export interface CongestionCell {
  x: number;
  y: number;
  radius: number;
  level: number; // 0-1
  timeRange: string; // "10:00-11:00" など
}

export interface Landmark {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "ベンチ" | "売店" | "トイレ" | "日陰";
}

export type DetailSelection =
  | { kind: "stay"; participant: Participant; stay: StayPoint }
  | { kind: "photoCluster"; participant: Participant; photos: Photo[]; x: number; y: number }
  | { kind: "aggregateHeat"; label: string; x: number; y: number; weight: number; entries: AggregateEntry[] }
  | null;

export interface AggregateEntry {
  participant: Participant;
  kind: "stay" | "photo";
  stay?: StayPoint;
  photo?: Photo;
}

export type HeatmapAttribute = "滞在時間" | "写真枚数" | "動物写真" | "風景写真" | "人物写真" | "期待と一致した写真";

export interface LayerToggles {
  route: boolean;
  stays: boolean;
  photos: boolean;
  weather: boolean;
  congestion: boolean;
  drawing: boolean;
}

