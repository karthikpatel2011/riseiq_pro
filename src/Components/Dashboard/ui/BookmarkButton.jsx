export default function BookmarkButton({ active, onClick, size = 18 }) {
  return (
    <button
      className={`db-bm-btn${active ? " db-bm-btn--active" : ""}`}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={active ? "Remove bookmark" : "Bookmark"}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
      </svg>
    </button>
  );
}
