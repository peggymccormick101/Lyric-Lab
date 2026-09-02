import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LyricsForm from "../components/LyricsForm.jsx";
import HeroPanel from "../components/HeroPanel.jsx";
import { deleteSong, listSongs } from "../api.js";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    listSongs()
      .then(setSongs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(song) {
    navigate(`/songs/${song.id}`);
  }

  async function handleDelete(e, song) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete "${song.title || song.topic}"?`)) return;
    setDeletingId(song.id);
    setError(null);
    try {
      await deleteSong(song.id);
      setSongs((prev) => prev.filter((s) => s.id !== song.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <HeroPanel />
        <LyricsForm onCreated={handleCreated} />
      </div>
      {error && <p className="error">{error}</p>}

      <section className="song-list-section">
        <h2>Your Lyrics</h2>
        {loading && <p>Loading...</p>}
        {!loading && songs.length === 0 && <p>No songs yet — create your first one above.</p>}
        <ul className="song-list">
          {songs.map((s) => (
            <li key={s.id}>
              <a
                className="song-link"
                href={`/songs/${s.id}`}
                onClick={(e) => { e.preventDefault(); navigate(`/songs/${s.id}`); }}
              >
                <span className="song-title">{s.title || s.topic}</span>
                <span className="song-meta">{s.genre} · {s.mood} · {s.length}</span>
              </a>
              <button
                type="button"
                className="delete-button"
                onClick={(e) => handleDelete(e, s)}
                disabled={deletingId === s.id}
                aria-label={`Delete ${s.title || s.topic}`}
              >
                {deletingId === s.id ? "Deleting…" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
