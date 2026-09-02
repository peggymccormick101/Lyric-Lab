import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LyricsDisplay from "../components/LyricsDisplay.jsx";
import { deleteSong, getSong } from "../api.js";

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSong(id)
      .then(setSong)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Delete "${song.title || song.topic}"?`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteSong(id);
      navigate("/");
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!song) return null;

  return (
    <div className="song-detail">
      <div className="song-detail-header">
        <Link to="/" className="back-link">
          ← All songs
        </Link>
        <button type="button" className="delete-button" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete song"}
        </button>
      </div>

      <h1>{song.title || song.topic}</h1>
      <p className="song-subheading">
        {song.genre} · {song.mood} · {song.style} · {song.perspective} · {song.length}
      </p>

      <section>
        <LyricsDisplay lyrics={song.lyrics} />
      </section>
    </div>
  );
}
