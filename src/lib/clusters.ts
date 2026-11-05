import type { Photo } from "../types";

export interface PhotoCluster {
  id: string;
  x: number;
  y: number;
  photos: Photo[];
}

// 近接写真をまとめて1つのピンにする(縮小表示用)
export function clusterPhotos(photos: Photo[], threshold: number): PhotoCluster[] {
  const clusters: PhotoCluster[] = [];

  for (const photo of photos) {
    const near = clusters.find((c) => Math.hypot(c.x - photo.x, c.y - photo.y) <= threshold);
    if (near) {
      const n = near.photos.length;
      near.x = (near.x * n + photo.x) / (n + 1);
      near.y = (near.y * n + photo.y) / (n + 1);
      near.photos.push(photo);
    } else {
      clusters.push({ id: `cluster-${clusters.length}-${photo.id}`, x: photo.x, y: photo.y, photos: [photo] });
    }
  }

  return clusters;
}
