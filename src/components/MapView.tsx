import { useMemo } from "react";
import type {
  DetailSelection,
  GPSPoint,
  HeatmapAttribute,
  LayerToggles,
  Participant,
  Photo,
} from "../types";
import { detectStayPoints } from "../lib/stayPoints";
import { clusterPhotos } from "../lib/clusters";
import { clusterWeighted } from "../lib/heatmap";
import { positionAtTime } from "../lib/interpolate";
import { LANDMARKS, SHADED_AREAS } from "../data/zones";
import { CONGESTION_CELLS } from "../data/mockData";
import AbstractMap from "./AbstractMap";

interface MapViewProps {
  mode: "individual" | "aggregate";
  participants: Participant[]; // individual: [selected] / aggregate: all
  radius: number;
  minDuration: number;
  layers: LayerToggles;
  zoom: number;
  animT: number | null;
  heatmapOn: boolean;
  heatmapAttribute: HeatmapAttribute;
  onSelectDetail: (d: DetailSelection) => void;
  selected: DetailSelection;
}

const PHOTO_CLUSTER_THRESHOLD = 1.5;
const HEAT_CLUSTER_THRESHOLD = 3;

function tagToAttr(tag: Photo["tag"]): HeatmapAttribute | null {
  if (tag === "動物") return "動物写真";
  if (tag === "風景") return "風景写真";
  if (tag === "人物") return "人物写真";
  return null;
}

export default function MapView({
  mode,
  participants,
  radius,
  minDuration,
  layers,
  zoom,
  animT,
  heatmapOn,
  heatmapAttribute,
  onSelectDetail,
  selected,
}: MapViewProps) {
  const perParticipantStays = useMemo(
    () => participants.map((p) => ({ participant: p, stays: detectStayPoints(p.route, radius, minDuration, LANDMARKS) })),
    [participants, radius, minDuration]
  );

  const showClustered = zoom < 1.8;

  const photoClustersPerParticipant = useMemo(
    () =>
      participants.map((p) => ({
        participant: p,
        clusters: showClustered ? clusterPhotos(p.photos, PHOTO_CLUSTER_THRESHOLD) : clusterPhotos(p.photos, 0.01),
      })),
    [participants, showClustered]
  );

  const heatCells = useMemo(() => {
    if (!heatmapOn) return [];
    type Entry = { x: number; y: number; participant: Participant; stay?: ReturnType<typeof detectStayPoints>[number]; photo?: Photo };
    let entries: Entry[] = [];

    if (heatmapAttribute === "滞在時間") {
      entries = perParticipantStays.flatMap(({ participant, stays }) =>
        stays.map((stay) => ({ x: stay.x, y: stay.y, participant, stay }))
      );
      return clusterWeighted(entries, (e) => e.stay!.duration, HEAT_CLUSTER_THRESHOLD);
    }

    const photoEntries: Entry[] = participants.flatMap((participant) =>
      participant.photos
        .filter((photo) => {
          if (heatmapAttribute === "写真枚数") return true;
          if (heatmapAttribute === "期待と一致した写真") return participant.expectationTags.includes(photo.tag);
          return tagToAttr(photo.tag) === heatmapAttribute;
        })
        .map((photo) => ({ x: photo.x, y: photo.y, participant, photo }))
    );
    return clusterWeighted(photoEntries, () => 1, HEAT_CLUSTER_THRESHOLD);
  }, [heatmapOn, heatmapAttribute, perParticipantStays, participants]);

  const maxHeatWeight = useMemo(() => Math.max(1, ...heatCells.map((c) => c.weight)), [heatCells]);

  const animPositions: { participant: Participant; pos: GPSPoint }[] = useMemo(() => {
    if (animT === null) return [];
    return participants
      .map((p) => ({ participant: p, pos: positionAtTime(p.route, animT) }))
      .filter((e): e is { participant: Participant; pos: GPSPoint } => e.pos !== null);
  }, [participants, animT]);

  return (
    <div className="map-scroll">
      <div className="map-inner" style={{ width: `${zoom * 100}%` }}>
        <AbstractMap />

        {layers.weather && (
          <svg className="overlay-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {SHADED_AREAS.map((area) => (
              <polygon
                key={area.id}
                points={area.points.map((p) => `${p.x},${p.y}`).join(" ")}
                className="shaded-area"
              />
            ))}
          </svg>
        )}

        {layers.congestion && (
          <svg className="overlay-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {CONGESTION_CELLS.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={c.radius}
                className="congestion-cell"
                style={{ fillOpacity: 0.12 + c.level * 0.35 }}
              />
            ))}
          </svg>
        )}

        <svg className="overlay-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {layers.route &&
            !heatmapOn &&
            participants.map((p) => (
              <polyline
                key={p.id}
                points={p.route.map((pt) => `${pt.x},${pt.y}`).join(" ")}
                fill="none"
                stroke={p.color}
                strokeWidth={0.35}
                strokeOpacity={0.7}
              />
            ))}

          {layers.route &&
            !heatmapOn &&
            animPositions.map(({ participant, pos }) => (
              <g key={participant.id}>
                <polyline
                  points={participant.route
                    .filter((pt) => pt.t <= pos.t)
                    .map((pt) => `${pt.x},${pt.y}`)
                    .join(" ")}
                  fill="none"
                  stroke={participant.color}
                  strokeWidth={0.6}
                />
                <circle cx={pos.x} cy={pos.y} r={1.1} fill={participant.color} stroke="#fff" strokeWidth={0.25} />
              </g>
            ))}

          {layers.stays &&
            !heatmapOn &&
            perParticipantStays.map(({ participant, stays }) =>
              stays.map((stay, idx) => {
                const r = Math.min(6, 1.3 + stay.duration / 150);
                const isSelected = selected?.kind === "stay" && selected.stay === stay;
                return (
                  <circle
                    key={`${participant.id}-stay-${idx}`}
                    cx={stay.x}
                    cy={stay.y}
                    r={r}
                    className="stay-circle"
                    stroke={participant.color}
                    fill={participant.color}
                    fillOpacity={isSelected ? 0.55 : 0.28}
                    strokeWidth={isSelected ? 0.6 : 0.3}
                    onClick={() => onSelectDetail({ kind: "stay", participant, stay })}
                  />
                );
              })
            )}

          {layers.drawing &&
            !heatmapOn &&
            participants.flatMap((p) =>
              p.drawingHighlights.map((dh, idx) => (
                <circle
                  key={`${p.id}-draw-${idx}`}
                  cx={dh.x}
                  cy={dh.y}
                  r={2.2}
                  className="drawing-highlight"
                  onClick={() =>
                    onSelectDetail({
                      kind: "aggregateHeat",
                      label: dh.label,
                      x: dh.x,
                      y: dh.y,
                      weight: 1,
                      entries: [{ participant: p, kind: "stay" }],
                    })
                  }
                />
              ))
            )}

          {heatmapOn &&
            heatCells.map((cell, idx) => {
              const r = 2 + (cell.weight / maxHeatWeight) * 6;
              return (
                <circle
                  key={idx}
                  cx={cell.x}
                  cy={cell.y}
                  r={r}
                  className="heat-cell"
                  fillOpacity={0.25 + (cell.weight / maxHeatWeight) * 0.45}
                  onClick={() =>
                    onSelectDetail({
                      kind: "aggregateHeat",
                      label: heatmapAttribute,
                      x: cell.x,
                      y: cell.y,
                      weight: cell.weight,
                      entries: cell.items.map((it) => ({
                        participant: (it as any).participant,
                        kind: (it as any).stay ? "stay" : "photo",
                        stay: (it as any).stay,
                        photo: (it as any).photo,
                      })),
                    })
                  }
                />
              );
            })}
        </svg>

        {layers.photos &&
          !heatmapOn &&
          photoClustersPerParticipant.map(({ participant, clusters }) =>
            clusters.map((cluster) => (
              <button
                key={cluster.id}
                className="photo-pin"
                style={{ left: `${cluster.x}%`, top: `${cluster.y}%`, borderColor: participant.color }}
                onClick={() =>
                  onSelectDetail({ kind: "photoCluster", participant, photos: cluster.photos, x: cluster.x, y: cluster.y })
                }
                title={`${participant.name}: ${cluster.photos.length}枚`}
              >
                {cluster.photos.length}
              </button>
            ))
          )}
      </div>
    </div>
  );
}
