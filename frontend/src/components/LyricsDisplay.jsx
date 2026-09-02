const SECTION_PATTERN = /^\s*\[[^\]]+\]\s*$/;

export default function LyricsDisplay({ lyrics }) {
  if (!lyrics) return <p>No lyrics yet.</p>;

  const lines = lyrics.split("\n");

  return (
    <div className="lyrics-display">
      {lines.map((line, i) =>
        SECTION_PATTERN.test(line) ? (
          <div className="lyrics-section-label" key={i}>{line.trim()}</div>
        ) : (
          <div className="lyrics-line" key={i}>{line || " "}</div>
        )
      )}
    </div>
  );
}
