import { timeAgo } from "../../hooks/useFeed";

function Avatar({ authorName, authorPhotoURL }) {
  const initial = authorName ? authorName.charAt(0).toUpperCase() : "?";
  if (authorPhotoURL) {
    return (
      <img
        className="dash-card-avatar"
        src={authorPhotoURL}
        alt={authorName}
      />
    );
  }
  return <div className="dash-card-avatar dash-card-avatar--init">{initial}</div>;
}

function PlacementCard({ item, onTap }) {
  const {
    company,
    role,
    experienceSummary,
    ctc,
    authorName,
    authorPhotoURL,
    createdAt,
  } = item;

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTap(item);
    }
  }

  function stop(e) {
    e.stopPropagation();
  }

  return (
    <article
      className="dash-card dash-card--placement"
      role="button"
      tabIndex={0}
      onClick={() => onTap(item)}
      onKeyDown={handleKeyDown}
    >
      <div className="dash-card-tags">
        <span className="dash-card-tag dash-card-tag--placement">Placement</span>
        <span className="dash-card-subject">
          {company}
          {role ? ` · ${role}` : ""}
        </span>
      </div>

      <h3 className="dash-card-title">
        {company} Interview Experience{role ? ` – ${role}` : ""}
      </h3>

      <p className="dash-card-body">{experienceSummary}</p>

      {ctc && <div className="dash-card-ctc">{ctc}</div>}

      <div className="dash-card-footer">
        <div className="dash-card-user">
          <Avatar authorName={authorName} authorPhotoURL={authorPhotoURL} />
          <span className="dash-card-username">{authorName}</span>
          <span className="dash-card-dot">·</span>
          <span className="dash-card-time">{timeAgo(createdAt)}</span>
        </div>

        <button className="dash-card-readmore" onClick={stop}>
          Read More →
        </button>
      </div>
    </article>
  );
}

export default PlacementCard;
