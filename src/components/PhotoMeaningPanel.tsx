import type { Participant, PhotoTag } from "../types";

const TAGS: PhotoTag[] = ["動物", "風景", "人物", "その他"];

function countByTag(participants: Participant[]) {
  const counts: Record<PhotoTag, number> = { 動物: 0, 風景: 0, 人物: 0, その他: 0 };
  for (const p of participants) {
    for (const ph of p.photos) counts[ph.tag]++;
  }
  return counts;
}

export default function PhotoMeaningPanel({ participants }: { participants: Participant[] }) {
  const counts = countByTag(participants);
  const totalPhotos = participants.reduce((s, p) => s + p.photos.length, 0);
  const max = Math.max(1, ...Object.values(counts));

  const matched = participants.reduce(
    (s, p) => s + p.photos.filter((ph) => p.expectationTags.includes(ph.tag)).length,
    0
  );
  const matchRate = totalPhotos > 0 ? Math.round((matched / totalPhotos) * 100) : 0;

  return (
    <div className="panel photo-meaning-panel">
      <h2>写真の意味分析 × 期待アンケート</h2>

      {participants.length === 1 && (
        <p className="muted small">
          「今日の楽しみなこと」: {participants[0].expectationText}
          <br />
          期待タグ: {participants[0].expectationTags.join(" / ")}
        </p>
      )}

      <h3>撮影された写真の内訳(枚数で相関を見る)</h3>
      <div className="bar-chart">
        {TAGS.map((tag) => (
          <div key={tag} className="bar-row">
            <span className={`tag tag-${tag}`}>{tag}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(counts[tag] / max) * 100}%` }} />
            </div>
            <span className="bar-count">{counts[tag]}枚</span>
          </div>
        ))}
      </div>

      <p className="correlation-note">
        期待していたこと(タグ)と実際に撮った写真のタグが一致した割合: <b>{matchRate}%</b>({matched}/{totalPhotos}枚)
      </p>
      <p className="muted small">
        ※タグ付けは人が行う想定(機械学習による下書きを人がチェックする運用も想定)。ここでは手動のモックデータ。
      </p>
    </div>
  );
}
