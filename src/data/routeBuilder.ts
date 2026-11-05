import type { GPSPoint, Point } from "../types";

// 再現性のある擬似乱数(デモデータ生成用)
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Waypoint {
  point: Point;
  dwellSec?: number; // この地点に留まる秒数(滞在を作る)
}

// waypoint列から、移動中の点列+滞在中の点列を合成してGPS軌跡を作る
export function buildRoute(waypoints: Waypoint[], seed: number): GPSPoint[] {
  const rand = mulberry32(seed);
  const route: GPSPoint[] = [];
  let t = 0;

  const jitter = (amount: number) => (rand() - 0.5) * 2 * amount;

  for (let i = 0; i < waypoints.length; i++) {
    const wp = waypoints[i];

    if (i > 0) {
      const prev = waypoints[i - 1].point;
      const dx = wp.point.x - prev.x;
      const dy = wp.point.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(4, Math.round(dist / 1.5));
      for (let s = 1; s <= steps; s++) {
        const f = s / steps;
        route.push({
          x: prev.x + dx * f + jitter(0.4),
          y: prev.y + dy * f + jitter(0.4),
          t,
        });
        t += 6 + rand() * 6; // 歩行: 1点あたり約6〜12秒
      }
    } else {
      route.push({ x: wp.point.x, y: wp.point.y, t });
      t += 5;
    }

    if (wp.dwellSec && wp.dwellSec > 0) {
      const dwellPoints = Math.max(3, Math.round(wp.dwellSec / 12));
      for (let d = 0; d < dwellPoints; d++) {
        route.push({
          x: wp.point.x + jitter(0.5),
          y: wp.point.y + jitter(0.5),
          t,
        });
        t += wp.dwellSec / dwellPoints;
      }
    }
  }

  return route;
}
