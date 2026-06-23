import { useState } from "react";

export default function CommentComposer({ parentCollection, parentId, currentUser, onPosted }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) { setError("Write something first."); return; }

    setLoading(true);
    setError("");
    try {
      const { addComment } = await import("../../../lib/content");
      await addComment(parentCollection, parentId, {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "User",
        body,
      });
      setBody("");
      onPosted?.();
    } catch (err) {
      setError("Failed to comment. Try again.");
    }
    setLoading(false);
  };

  return (
    <form className="db-composer" onSubmit={handleSubmit}>
      <textarea
        className="db-composer-input"
        rows={2}
        placeholder="Add a comment…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={loading}
      />
      <div className="db-composer-actions">
        {error && <span className="db-composer-err">{error}</span>}
        <button className="db-composer-btn" disabled={loading || !body.trim()}>
          {loading ? "Posting…" : "Comment"}
        </button>
      </div>
    </form>
  );
}
