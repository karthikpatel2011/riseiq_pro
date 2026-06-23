import { useState } from "react";
import Avatar from "../ui/Avatar";
import BookmarkButton from "../ui/BookmarkButton";
import { timeAgo } from "../../../hooks/useFeed";
import { toggleBookmark } from "../../../lib/content";

export default function DoubtCard({ item, currentUser, expanded, onToggle }) {
  const [bmActive, setBmActive] = useState(false);
  const uid = currentUser?.uid;

  const handleBookmark = async () => {
    if (!uid) return;
    const added = await toggleBookmark(uid, {
      contentType: "doubt",
      contentId: item.id,
      contentTitle: item.title,
      extra: { branch: item.branch, subject: item.subject },
    });
    setBmActive(added);
  };

  return (
    <div className="db-card db-card--doubt">
      <div className="db-card-head">
        <Avatar src={item.authorPhotoURL} name={item.authorName} size={30} />
        <div className="db-card-meta">
          <span className="db-card-author">{item.authorName}</span>
          <span className="db-card-time">{timeAgo(item.createdAt)}</span>
        </div>
        <div className="db-card-tags">
          <span className="db-card-badge db-card-badge--subject">{item.subject}</span>
          <span className="db-card-badge db-card-badge--branch">{item.branch}</span>
        </div>
        <BookmarkButton active={bmActive} onClick={handleBookmark} />
      </div>

      <h3 className="db-card-title">{item.title}</h3>
      {item.body && <p className="db-card-body">{item.body}</p>}

      <div className="db-card-foot">
        <button className="db-card-stat" onClick={onToggle}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          {item.answerCount || 0} {item.answerCount === 1 ? "answer" : "answers"}
        </button>
        {expanded !== undefined && (
          <span className="db-card-expand-label">
            {expanded ? "Collapse" : "View answers"}
          </span>
        )}
      </div>
    </div>
  );
}
