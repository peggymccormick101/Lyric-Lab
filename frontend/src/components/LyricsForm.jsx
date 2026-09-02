import { useState } from "react";
import { createSong } from "../api.js";

const GENRES = [
  "Pop", "Rock", "Country", "Folk", "Blues", "R&B", "Hip-Hop",
  "Punk", "Indie", "Electronic", "Jazz", "Metal", "Reggae",
];
const MOODS = [
  "Happy", "Sad", "Angry", "Romantic", "Nostalgic", "Inspirational",
  "Hopeful", "Melancholic", "Playful", "Confident",
];
const STYLES = ["Simple", "Poetic", "Storytelling", "Witty", "Emotional"];
const PERSPECTIVES = ["First person", "Second person", "Third person"];
const LENGTHS = ["Short", "Standard", "Long"];

const TOPIC_MAX = 200;

export default function LyricsForm({ onCreated }) {
  const [topic, setTopic] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [style, setStyle] = useState("");
  const [perspective, setPerspective] = useState("");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("Standard");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit =
    topic.trim().length > 0 && genre && mood && style && perspective && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const song = await createSong({
        topic: topic.trim(),
        genre,
        mood,
        style,
        perspective,
        keywords: keywords.trim() || null,
        length,
      });
      onCreated(song);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="lyrics-form" onSubmit={handleSubmit}>
      <h2>
        <span className="form-note">🎵</span> Create Your Song Lyrics
      </h2>
      <p className="form-subtitle">Tell us what you want — we'll turn it into lyrics.</p>

      <label className="field">
        <span className="field-label">1. What's your song about?</span>
        <textarea
          placeholder="e.g., a summer road trip, new love, chasing dreams..."
          value={topic}
          maxLength={TOPIC_MAX}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          required
        />
        <span className="char-counter">{topic.length}/{TOPIC_MAX}</span>
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field-label">2. Genre</span>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
            <option value="" disabled>Select a genre</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">3. Mood</span>
          <select value={mood} onChange={(e) => setMood(e.target.value)} required>
            <option value="" disabled>Select a mood</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="field">
        <span className="field-label">4. Style of Lyrics</span>
        <div className="chip-group">
          {STYLES.map((s) => (
            <button
              type="button"
              key={s}
              className={`chip ${style === s ? "chip-selected" : ""}`}
              onClick={() => setStyle(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field-label">5. Perspective</span>
        <div className="chip-group">
          {PERSPECTIVES.map((p) => (
            <button
              type="button"
              key={p}
              className={`chip ${perspective === p ? "chip-selected" : ""}`}
              onClick={() => setPerspective(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="field-label">6. Key words or phrases to include (optional)</span>
        <input
          type="text"
          placeholder="e.g., lake, memories, sunrise, second chance..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </label>

      <div className="field">
        <span className="field-label">7. Length</span>
        <div className="chip-group">
          {LENGTHS.map((l) => (
            <button
              type="button"
              key={l}
              className={`chip ${length === l ? "chip-selected" : ""}`}
              onClick={() => setLength(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="generate-button" disabled={!canSubmit}>
        {submitting ? "Writing your lyrics..." : "✨ Generate My Lyrics"}
      </button>
    </form>
  );
}
