export default function LikeButton({ count, active, onClick, size = 18 }) {
  return (
    <button
      className={`db-like-btn${active ? " db-like-btn--active" : ""}`}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={active ? "Remove upvote" : "Upvote"}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2h0a3.13 3.13 0 013 3.88Z"/>
      </svg>
      {count > 0 && <span className="db-like-count">{count}</span>}
    </button>
  );
}
