export interface HeatCell<T> {
  x: number;
  y: number;
  weight: number;
  items: T[];
}

// 近接する点を重み付きでまとめる(滞在時間ヒートマップ・写真枚数ヒートマップ等に利用)
export function clusterWeighted<T extends { x: number; y: number }>(
  items: T[],
  weightFn: (t: T) => number,
  threshold: number
): HeatCell<T>[] {
  const cells: HeatCell<T>[] = [];

  for (const item of items) {
    const w = weightFn(item);
    if (w <= 0) continue;
    const near = cells.find((c) => Math.hypot(c.x - item.x, c.y - item.y) <= threshold);
    if (near) {
      const totalW = near.weight + w;
      near.x = (near.x * near.weight + item.x * w) / totalW;
      near.y = (near.y * near.weight + item.y * w) / totalW;
      near.weight = totalW;
      near.items.push(item);
    } else {
      cells.push({ x: item.x, y: item.y, weight: w, items: [item] });
    }
  }

  return cells;
}
