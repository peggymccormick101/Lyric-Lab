import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SongDetail from "./pages/SongDetail.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="brand-note">🎵</span> Lyric<span className="brand-accent">Lab</span>
        </Link>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs/:id" element={<SongDetail />} />
        </Routes>
      </main>
    </div>
  );
}
