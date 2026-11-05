import type { HeatmapAttribute, LayerToggles, Participant } from "../types";

interface ControlsPanelProps {
  mode: "individual" | "aggregate";
  setMode: (m: "individual" | "aggregate") => void;
  participants: Participant[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  radius: number;
  setRadius: (v: number) => void;
  minDuration: number;
  setMinDuration: (v: number) => void;
  layers: LayerToggles;
  toggleLayer: (k: keyof LayerToggles) => void;
  zoom: number;
  setZoom: (v: number) => void;
  heatmapOn: boolean;
  setHeatmapOn: (v: boolean) => void;
  heatmapAttribute: HeatmapAttribute;
  setHeatmapAttribute: (v: HeatmapAttribute) => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  currentT: number;
  maxT: number;
  setCurrentT: (v: number) => void;
}

const HEAT_OPTIONS: HeatmapAttribute[] = ["滞在時間", "写真枚数", "動物写真", "風景写真", "人物写真", "期待と一致した写真"];

export default function ControlsPanel(p: ControlsPanelProps) {
  return (
    <div className="panel controls-panel">
      <h2>表示モード</h2>
      <div className="mode-toggle">
        <button className={p.mode === "individual" ? "active" : ""} onClick={() => p.setMode("individual")}>
          個人ごと
        </button>
        <button className={p.mode === "aggregate" ? "active" : ""} onClick={() => p.setMode("aggregate")}>
          全員(統合)
        </button>
      </div>

      {p.mode === "individual" && (
        <>
          <h3>参加者</h3>
          <div className="participant-select">
            {p.participants.map((part) => (
              <button
                key={part.id}
                className={p.selectedId === part.id ? "active" : ""}
                style={{ borderColor: part.color }}
                onClick={() => p.setSelectedId(part.id)}
              >
                <span className="dot" style={{ background: part.color }} />
                {part.name}({part.affiliation}/{part.age}歳/{part.weather})
              </button>
            ))}
          </div>

          <h3>アニメーション再生</h3>
          <div className="anim-controls">
            <button onClick={() => p.setPlaying(!p.playing)}>{p.playing ? "⏸ 一時停止" : "▶ 再生"}</button>
            <label>
              速度 x{p.speed}
              <input type="range" min={1} max={20} step={1} value={p.speed} onChange={(e) => p.setSpeed(Number(e.target.value))} />
            </label>
            <label>
              時刻: {Math.floor(p.currentT / 60)}分{Math.floor(p.currentT % 60)}秒 / {Math.floor(p.maxT / 60)}分
              <input
                type="range"
                min={0}
                max={p.maxT}
                step={1}
                value={p.currentT}
                onChange={(e) => {
                  p.setPlaying(false);
                  p.setCurrentT(Number(e.target.value));
                }}
              />
            </label>
          </div>
        </>
      )}

      {p.mode === "aggregate" && (
        <>
          <h3>統合ヒートマップ</h3>
          <label className="checkbox-row">
            <input type="checkbox" checked={p.heatmapOn} onChange={(e) => p.setHeatmapOn(e.target.checked)} />
            ヒートマップを表示
          </label>
          {p.heatmapOn && (
            <select value={p.heatmapAttribute} onChange={(e) => p.setHeatmapAttribute(e.target.value as HeatmapAttribute)}>
              {HEAT_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}
        </>
      )}

      <h3>滞在地点の判定条件</h3>
      <label>
        半径: {p.radius.toFixed(1)}(地図比%。実寸では約{Math.round(p.radius * 15)}m相当)
        <input type="range" min={1} max={10} step={0.5} value={p.radius} onChange={(e) => p.setRadius(Number(e.target.value))} />
      </label>
      <label>
        最低滞在時間: {p.minDuration}秒
        <input type="range" min={10} max={300} step={10} value={p.minDuration} onChange={(e) => p.setMinDuration(Number(e.target.value))} />
      </label>

      <h3>レイヤー表示</h3>
      <div className="layer-toggles">
        <label>
          <input type="checkbox" checked={p.layers.route} onChange={() => p.toggleLayer("route")} /> 経路
        </label>
        <label>
          <input type="checkbox" checked={p.layers.stays} onChange={() => p.toggleLayer("stays")} /> 滞在円
        </label>
        <label>
          <input type="checkbox" checked={p.layers.photos} onChange={() => p.toggleLayer("photos")} /> 写真ピン
        </label>
        <label>
          <input type="checkbox" checked={p.layers.drawing} onChange={() => p.toggleLayer("drawing")} /> 絵に描かれた場所
        </label>
        <label>
          <input type="checkbox" checked={p.layers.weather} onChange={() => p.toggleLayer("weather")} /> 天候(屋根・日陰)
        </label>
        <label>
          <input type="checkbox" checked={p.layers.congestion} onChange={() => p.toggleLayer("congestion")} /> 混雑度
        </label>
      </div>

      <h3>ズーム</h3>
      <label>
        {p.zoom.toFixed(1)}倍 ({p.zoom < 1.8 ? "写真は集約表示" : "写真は個別表示"})
        <input type="range" min={1} max={3} step={0.25} value={p.zoom} onChange={(e) => p.setZoom(Number(e.target.value))} />
      </label>
    </div>
  );
}
