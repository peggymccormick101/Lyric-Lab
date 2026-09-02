import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LyricsDisplay from "../components/LyricsDisplay.jsx";
import LyricsChat from "../components/LyricsChat.jsx";
import { deleteSong, getSong, reviseSong } from "../api.js";

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [revising, setRevising] = useState(false);
  const [chatError, setChatError] = useState(null);

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

  async function handleRevise(message) {
    setRevising(true);
    setChatError(null);
    setSong((s) => ({
      ...s,
      messages: [
        ...s.messages,
        { id: `tmp-${Date.now()}`, role: "user", content: message, created_at: new Date().toISOString() },
      ],
    }));
    try {
      await reviseSong(id, message);
      const fresh = await getSong(id);
      setSong(fresh);
    } catch (e) {
      setChatError(e.message);
    } finally {
      setRevising(false);
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

      <section>
        <h2>Request changes</h2>
        {chatError && <p className="error">{chatError}</p>}
        <LyricsChat messages={song.messages} onSend={handleRevise} sending={revising} />
      </section>
    </div>
  );
}
