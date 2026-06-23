import { useBookmarks } from "../../../hooks/useContent";
import { timeAgo } from "../../../hooks/useFeed";
import Avatar from "../ui/Avatar";
import EmptyState from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";

const TYPE_CONFIG = {
  doubt:      { label: "Doubt",      color: "#6366F1", bg: "#EEF2FF", collection: "doubts" },
  project:    { label: "Project",    color: "#22C55E", bg: "#F0FDF4", collection: "projects" },
  placement:  { label: "Placement",  color: "#F97316", bg: "#FFF7ED", collection: "placementStories" },
};

function BookmarkGroup({ title, items, color }) {
  if (items.length === 0) return null;
  return (
    <div className="db-bm-group">
      <h3 className="db-bm-group-title" style={{ color }}>{title} ({items.length})</h3>
      <div className="db-bm-list">
        {items.map((b) => (
          <div key={b.id} className="db-bm-item">
            <div className="db-bm-item-info">
              <span className="db-bm-item-title">{b.contentTitle}</span>
              <span className="db-bm-item-time">{timeAgo(b.createdAt)}</span>
            </div>
            {b.extra?.branch && <span className="db-card-badge db-card-badge--branch">{b.extra.branch}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BookmarksView({ currentUser }) {
  const uid = currentUser?.uid;
  const { items, loading, byType } = useBookmarks(uid);

  if (loading) {
    return (
      <div className="db-view-loading">
        <div className="db-view-spinner" />
        <p>Loading bookmarks…</p>
      </div>
    );
  }

  return (
    <div className="db-view db-view--bookmarks">
      <div className="db-view-head">
        <h2 className="db-view-title">Bookmarks</h2>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Bookmark doubts, projects, and placement stories to find them easily later."
        />
      ) : (
        <>
          <BookmarkGroup title="Doubts" items={byType.doubts} color={TYPE_CONFIG.doubt.color} />
          <BookmarkGroup title="Projects" items={byType.projects} color={TYPE_CONFIG.project.color} />
          <BookmarkGroup title="Placements" items={byType.placements} color={TYPE_CONFIG.placement.color} />
        </>
      )}
    </div>
  );
}
