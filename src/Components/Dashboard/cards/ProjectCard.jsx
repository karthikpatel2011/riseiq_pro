import { useState } from "react";
import Avatar from "../ui/Avatar";
import BookmarkButton from "../ui/BookmarkButton";
import { timeAgo } from "../../../hooks/useFeed";
import { toggleBookmark, joinProject } from "../../../lib/content";

export default function ProjectCard({ item, currentUser, expanded, onToggle }) {
  const [bmActive, setBmActive] = useState(false);
  const [joining, setJoining] = useState(false);
  const uid = currentUser?.uid;

  const handleBookmark = async () => {
    if (!uid) return;
    const added = await toggleBookmark(uid, {
      contentType: "project",
      contentId: item.id,
      contentTitle: item.title,
      extra: { skills: item.skillsNeeded },
    });
    setBmActive(added);
  };

  const handleJoin = async () => {
    if (!uid || uid === item.authorId || joining) return;
    setJoining(true);
    try { await joinProject(item.id); } catch (e) { console.error(e); }
    setJoining(false);
  };

  return (
    <div className="db-card db-card--project">
      <div className="db-card-head">
        <Avatar src="" name={item.authorName} size={30} />
        <div className="db-card-meta">
          <span className="db-card-author">{item.authorName}</span>
          <span className="db-card-time">{timeAgo(item.createdAt)}</span>
        </div>
        <BookmarkButton active={bmActive} onClick={handleBookmark} />
      </div>

      <h3 className="db-card-title">{item.title}</h3>
      <p className="db-card-body">{item.description}</p>

      {item.skillsNeeded?.length > 0 && (
        <div className="db-card-tags">
          {item.skillsNeeded.map((s) => (
            <span key={s} className="db-card-badge db-card-badge--skill">{s}</span>
          ))}
        </div>
      )}

      <div className="db-card-foot">
        <span className="db-card-stat">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          {item.teamSize || 0} members · {item.spotsOpen || 0} spots open
        </span>
        {uid && uid !== item.authorId && item.spotsOpen > 0 && (
          <button className="db-card-join-btn" onClick={handleJoin} disabled={joining}>
            {joining ? "Joining…" : "Join Project"}
          </button>
        )}
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
