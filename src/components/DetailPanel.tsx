import type { DetailSelection, Participant } from "../types";

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}分${s}秒`;
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const NEARBY_THRESHOLD = 3;

function nearbyInterview(p: Participant, x: number, y: number) {
  return p.interview.filter((iv) => Math.hypot(iv.x - x, iv.y - y) <= NEARBY_THRESHOLD);
}

function nearbyDrawing(p: Participant, x: number, y: number) {
  return p.drawingHighlights.filter((dh) => Math.hypot(dh.x - x, dh.y - y) <= NEARBY_THRESHOLD);
}

function nearbyPhotos(p: Participant, x: number, y: number) {
  return p.photos.filter((ph) => Math.hypot(ph.x - x, ph.y - y) <= NEARBY_THRESHOLD);
}

export default function DetailPanel({ selected }: { selected: DetailSelection }) {
  if (!selected) {
    return (
      <div className="panel detail-panel">
        <h2>詳細</h2>
        <p className="muted">地図上の滞在円・写真ピン・絵の場所マーカーをクリックすると、ここに詳細が表示されます。</p>
      </div>
    );
  }

  if (selected.kind === "stay") {
    const { participant: p, stay } = selected;
    const photos = nearbyPhotos(p, stay.x, stay.y);
    const interviews = nearbyInterview(p, stay.x, stay.y);
    const drawings = nearbyDrawing(p, stay.x, stay.y);
    return (
      <div className="panel detail-panel">
        <h2>
          <span className="dot" style={{ background: p.color }} /> 滞在地点の詳細
        </h2>
        <p>
          <b>{p.name}</b>が <b>{fmtDuration(stay.duration)}</b> 滞在({fmtTime(stay.startT)}〜{fmtTime(stay.endT)})
        </p>
        <p className="muted">
          周辺の設備: {stay.nearbyLandmarks.length ? stay.nearbyLandmarks.join(" / ") : "なし"}
        </p>
        <p className="muted">この周辺で撮られた写真: {photos.length}枚</p>
        {photos.length > 0 && (
          <ul className="photo-list">
            {photos.map((ph) => (
              <li key={ph.id}>
                <span className={`tag tag-${ph.tag}`}>{ph.tag}</span> {ph.label}: {ph.caption}
              </li>
            ))}
          </ul>
        )}
        {drawings.length > 0 && (
          <>
            <h3>絵に描かれていた内容</h3>
            {drawings.map((d, i) => (
              <p key={i} className="highlight-note">
                {d.label} — {d.note}
              </p>
            ))}
          </>
        )}
        {interviews.length > 0 && (
          <>
            <h3>ヒアリング内容</h3>
            {interviews.map((iv, i) => (
              <div key={i} className="interview-qa">
                <p className="q">Q. {iv.question}</p>
                <p className="a">A. {iv.answer}</p>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  if (selected.kind === "photoCluster") {
    const { participant: p, photos } = selected;
    return (
      <div className="panel detail-panel">
        <h2>
          <span className="dot" style={{ background: p.color }} /> 写真詳細({photos.length}枚)
        </h2>
        <ul className="photo-list detailed">
          {photos.map((ph) => (
            <li key={ph.id}>
              <div className={`photo-thumb tag-${ph.tag}`}>{ph.label}</div>
              <div>
                <p>
                  <span className={`tag tag-${ph.tag}`}>{ph.tag}</span> {ph.caption}
                </p>
                <p className="muted small">
                  撮影時刻 {fmtTime(ph.t)} ・ {ph.hasExifLocation ? "EXIF位置情報あり" : "位置情報なし(手動で特定)"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // aggregateHeat
  const { label, weight, entries, x, y } = selected;
  return (
    <div className="panel detail-panel">
      <h2>統合ヒートマップ詳細</h2>
      <p>
        <b>{label}</b> ・ 合計: {weight >= 60 ? fmtDuration(weight) : `${weight.toFixed(0)}`}
      </p>
      <p className="muted small">
        座標 ({x.toFixed(1)}, {y.toFixed(1)})
      </p>
      <ul className="photo-list detailed">
        {entries.map((e, i) => (
          <li key={i}>
            <div className="photo-thumb" style={{ background: e.participant.color }}>
              {e.participant.name[0]}
            </div>
            <div>
              {e.kind === "stay" && e.stay && (
                <p>
                  <b>{e.participant.name}</b>: {fmtDuration(e.stay.duration)}滞在
                </p>
              )}
              {e.kind === "photo" && e.photo && (
                <p>
                  <b>{e.participant.name}</b>: <span className={`tag tag-${e.photo.tag}`}>{e.photo.tag}</span>{" "}
                  {e.photo.caption}
                </p>
              )}
              {nearbyInterview(e.participant, x, y).map((iv, j) => (
                <p key={j} className="muted small">
                  「{iv.answer}」
                </p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
