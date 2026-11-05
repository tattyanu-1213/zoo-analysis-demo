import type { GPSPoint, StayPoint, Landmark } from "../types";

function dist(a: GPSPoint, b: GPSPoint) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 滞在地点検出。半径radius(% 座標)以内にN秒以上留まった区間を1つの滞在とみなす。
 * 古典的なstay-point detectionアルゴリズム。
 */
export function detectStayPoints(
  route: GPSPoint[],
  radius: number,
  minDurationSec: number,
  landmarks: Landmark[] = []
): StayPoint[] {
  const stays: StayPoint[] = [];
  let i = 0;

  while (i < route.length) {
    let j = i + 1;
    while (j < route.length && dist(route[i], route[j]) <= radius) {
      j++;
    }
    const last = j - 1;
    const duration = route[last].t - route[i].t;

    if (duration >= minDurationSec && last > i) {
      const segment = route.slice(i, last + 1);
      const cx = segment.reduce((s, p) => s + p.x, 0) / segment.length;
      const cy = segment.reduce((s, p) => s + p.y, 0) / segment.length;

      const nearby = landmarks
        .filter((lm) => Math.hypot(lm.x - cx, lm.y - cy) <= radius * 1.5)
        .map((lm) => lm.label);

      stays.push({
        x: cx,
        y: cy,
        startT: route[i].t,
        endT: route[last].t,
        duration,
        nearbyLandmarks: nearby,
      });
      i = last + 1;
    } else {
      i++;
    }
  }

  return stays;
}
