import { useState } from "react";

export default function AnswerComposer({ doubtId, currentUser, onPosted }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) { setError("Write something first."); return; }

    setLoading(true);
    setError("");
    try {
      const { addAnswer } = await import("../../../lib/content");
      await addAnswer(doubtId, {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "User",
        body,
      });
      setBody("");
      onPosted?.();
    } catch (err) {
      setError("Failed to post. Try again.");
    }
    setLoading(false);
  };

  return (
    <form className="db-composer" onSubmit={handleSubmit}>
      <textarea
        className="db-composer-input"
        rows={3}
        placeholder="Write your answer…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={loading}
      />
      <div className="db-composer-actions">
        {error && <span className="db-composer-err">{error}</span>}
        <button className="db-composer-btn" disabled={loading || !body.trim()}>
          {loading ? "Posting…" : "Post Answer"}
        </button>
      </div>
    </form>
  );
}
