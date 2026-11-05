import type { GPSPoint } from "../types";

// 経過秒tに対応する軌跡上の位置を線形補間で求める
export function positionAtTime(route: GPSPoint[], t: number): GPSPoint | null {
  if (route.length === 0) return null;
  if (t <= route[0].t) return route[0];
  if (t >= route[route.length - 1].t) return route[route.length - 1];

  for (let i = 0; i < route.length - 1; i++) {
    const a = route[i];
    const b = route[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, t };
    }
  }
  return route[route.length - 1];
}
