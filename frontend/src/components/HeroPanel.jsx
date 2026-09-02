const FEATURES = [
  { icon: "💡", label: "ANY THEME", desc: "From love songs to silly songs" },
  { icon: "🎸", label: "ANY GENRE", desc: "Pop, rock, country, hip-hop & more" },
  { icon: "🙂", label: "ANY MOOD", desc: "Happy, sad, funny, or fierce" },
  { icon: "✏️", label: "100% ORIGINAL", desc: "Lyrics crafted just for you" },
];

export default function HeroPanel() {
  return (
    <div className="hero-panel">
      <div className="hero-notes" aria-hidden="true">🎵 🎶 🎵</div>
      <h1 className="hero-logo">
        Lyric<span className="brand-accent">Lab</span>
      </h1>
      <p className="hero-tagline">
        Your ideas. Our lyrics. <span className="brand-accent">Pure inspiration.</span>
      </p>
      <p className="hero-instruction">
        Describe your song.<br />We'll write the lyrics.
      </p>

      <div className="hero-features">
        {FEATURES.map((f) => (
          <div className="hero-feature" key={f.label}>
            <div className="hero-feature-icon">{f.icon}</div>
            <div className="hero-feature-label">{f.label}</div>
            <div className="hero-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
