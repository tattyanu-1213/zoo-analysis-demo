import { useEffect, useRef, useState } from "react";
import "./App.css";
import MapView from "./components/MapView";
import ControlsPanel from "./components/ControlsPanel";
import DetailPanel from "./components/DetailPanel";
import PhotoMeaningPanel from "./components/PhotoMeaningPanel";
import { PARTICIPANTS } from "./data/mockData";
import type { DetailSelection, HeatmapAttribute, LayerToggles } from "./types";

const DEFAULT_LAYERS: LayerToggles = {
  route: true,
  stays: true,
  photos: true,
  drawing: true,
  weather: false,
  congestion: false,
};

export default function App() {
  const [mode, setMode] = useState<"individual" | "aggregate">("individual");
  const [selectedId, setSelectedId] = useState(PARTICIPANTS[0].id);
  const [radius, setRadius] = useState(3);
  const [minDuration, setMinDuration] = useState(60);
  const [layers, setLayers] = useState<LayerToggles>(DEFAULT_LAYERS);
  const [zoom, setZoom] = useState(1.5);
  const [heatmapOn, setHeatmapOn] = useState(true);
  const [heatmapAttribute, setHeatmapAttribute] = useState<HeatmapAttribute>("滞在時間");
  const [selected, setSelected] = useState<DetailSelection>(null);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(8);
  const [currentT, setCurrentT] = useState(0);

  const selectedParticipant = PARTICIPANTS.find((p) => p.id === selectedId) ?? PARTICIPANTS[0];
  const maxT = selectedParticipant.route[selectedParticipant.route.length - 1]?.t ?? 0;

  const frameRef = useRef<number | undefined>(undefined);
  const lastTsRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!playing) return;
    const step = (ts: number) => {
      if (lastTsRef.current === undefined) lastTsRef.current = ts;
      const dtSec = ((ts - lastTsRef.current) / 1000) * speed;
      lastTsRef.current = ts;
      setCurrentT((prev) => {
        const next = prev + dtSec;
        if (next >= maxT) {
          setPlaying(false);
          return maxT;
        }
        return next;
      });
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      lastTsRef.current = undefined;
    };
  }, [playing, speed, maxT]);

  useEffect(() => {
    setCurrentT(0);
    setPlaying(false);
    setSelected(null);
  }, [selectedId, mode]);

  const toggleLayer = (k: keyof LayerToggles) => setLayers((prev) => ({ ...prev, [k]: !prev[k] }));

  const mapParticipants = mode === "individual" ? [selectedParticipant] : PARTICIPANTS;
  const photoMeaningParticipants = mode === "individual" ? [selectedParticipant] : PARTICIPANTS;

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>動物園ランドスケープ分析ツール(構想プロトタイプ)</h1>
        <p className="muted small">
          GPS軌跡・滞在時間・撮影写真・事前アンケート・退園後の絵とヒアリングを、同じ地図上で突き合わせて分析する。
        </p>
      </header>
      <div className="app-body">
        <ControlsPanel
          mode={mode}
          setMode={setMode}
          participants={PARTICIPANTS}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          radius={radius}
          setRadius={setRadius}
          minDuration={minDuration}
          setMinDuration={setMinDuration}
          layers={layers}
          toggleLayer={toggleLayer}
          zoom={zoom}
          setZoom={setZoom}
          heatmapOn={heatmapOn}
          setHeatmapOn={setHeatmapOn}
          heatmapAttribute={heatmapAttribute}
          setHeatmapAttribute={setHeatmapAttribute}
          playing={playing}
          setPlaying={setPlaying}
          speed={speed}
          setSpeed={setSpeed}
          currentT={currentT}
          maxT={maxT}
          setCurrentT={setCurrentT}
        />

        <main className="map-area">
          <MapView
            mode={mode}
            participants={mapParticipants}
            radius={radius}
            minDuration={minDuration}
            layers={layers}
            zoom={zoom}
            animT={mode === "individual" ? currentT : null}
            heatmapOn={mode === "aggregate" && heatmapOn}
            heatmapAttribute={heatmapAttribute}
            onSelectDetail={setSelected}
            selected={selected}
          />
          <div className="legend">
            {PARTICIPANTS.map((p) => (
              <span key={p.id} className="legend-item">
                <span className="dot" style={{ background: p.color }} /> {p.name}
              </span>
            ))}
          </div>
        </main>

        <aside className="side-right">
          <DetailPanel selected={selected} />
          <PhotoMeaningPanel participants={photoMeaningParticipants} />
        </aside>
      </div>
    </div>
  );
}
