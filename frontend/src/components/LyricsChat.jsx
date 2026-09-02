import { useState } from "react";

export default function LyricsChat({ messages, onSend, sending }) {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  }

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">
            Ask for changes — "make the chorus more upbeat," "add a bridge,"
            "change the ending" — and the lyrics above will update.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`chat-message chat-${m.role}`}>
            <span className="chat-role">{m.role === "user" ? "You" : "LyricLab"}</span>
            <p>{m.content}</p>
          </div>
        ))}
        {sending && (
          <div className="chat-message chat-assistant">
            <span className="chat-role">LyricLab</span>
            <p className="chat-thinking">Revising…</p>
          </div>
        )}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g., make the second verse more hopeful"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
