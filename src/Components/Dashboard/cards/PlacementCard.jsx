import { useState } from "react";
import Avatar from "../ui/Avatar";
import BookmarkButton from "../ui/BookmarkButton";
import { timeAgo } from "../../../hooks/useFeed";
import { toggleBookmark } from "../../../lib/content";

export default function PlacementCard({ item, currentUser, expanded, onToggle }) {
  const [bmActive, setBmActive] = useState(false);
  const uid = currentUser?.uid;

  const handleBookmark = async () => {
    if (!uid) return;
    const added = await toggleBookmark(uid, {
      contentType: "placement",
      contentId: item.id,
      contentTitle: `${item.company} — ${item.role}`,
      extra: { company: item.company, role: item.role, branch: item.branch },
    });
    setBmActive(added);
  };

  return (
    <div className="db-card db-card--placement">
      <div className="db-card-head">
        <Avatar src="" name={item.authorName} size={30} />
        <div className="db-card-meta">
          <span className="db-card-author">{item.authorName}</span>
          <span className="db-card-time">{timeAgo(item.createdAt)}</span>
        </div>
        <div className="db-card-tags">
          <span className="db-card-badge db-card-badge--company">{item.company}</span>
          <span className="db-card-badge db-card-badge--branch">{item.branch}</span>
        </div>
        <BookmarkButton active={bmActive} onClick={handleBookmark} />
      </div>

      <h3 className="db-card-title">{item.role}</h3>
      <p className="db-card-body">{item.experienceSummary}</p>
      {item.ctc && <span className="db-card-ctc">{item.ctc}</span>}

      <div className="db-card-foot">
        <button className="db-card-stat" onClick={onToggle}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Comments
        </button>
      </div>
    </div>
  );
}
