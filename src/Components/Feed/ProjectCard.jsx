import { timeAgo } from "../../hooks/useFeed";

const MAX_VISIBLE_SKILLS = 4;

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

function ProjectCard({ item, onTap }) {
  const {
    title,
    description,
    skillsNeeded,
    spotsOpen,
    authorName,
    authorPhotoURL,
    createdAt,
  } = item;

  const visibleSkills = skillsNeeded
    ? skillsNeeded.slice(0, MAX_VISIBLE_SKILLS)
    : [];
  const hiddenCount =
    skillsNeeded && skillsNeeded.length > MAX_VISIBLE_SKILLS
      ? skillsNeeded.length - MAX_VISIBLE_SKILLS
      : 0;

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTap(item);
    }
  }

  return (
    <article
      className="dash-card dash-card--project"
      role="button"
      tabIndex={0}
      onClick={() => onTap(item)}
      onKeyDown={handleKeyDown}
    >
      <div className="dash-card-tags">
        <span className="dash-card-tag dash-card-tag--project">Project</span>
        <span className="dash-card-subject">
          {skillsNeeded?.[0] || "Team-Up"}
        </span>
      </div>

      <h3 className="dash-card-title">{title}</h3>

      <p className="dash-card-body">{description}</p>

      {skillsNeeded?.length ? (
        <div className="dash-card-skills">
          {visibleSkills.map((skill) => (
            <span key={skill} className="dash-card-skill">
              {skill}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="dash-card-skill dash-card-skill--more">
              +{hiddenCount} more
            </span>
          )}
        </div>
      ) : null}

      <div className="dash-card-footer">
        <div className="dash-card-user">
          <Avatar authorName={authorName} authorPhotoURL={authorPhotoURL} />
          <span className="dash-card-username">{authorName}</span>
          <span className="dash-card-dot">·</span>
          <span className="dash-card-time">{timeAgo(createdAt)}</span>
        </div>

        <span className="dash-card-interested">
          {spotsOpen
            ? `${spotsOpen} spot${spotsOpen === 1 ? "" : "s"} open`
            : "Team full"}
        </span>
      </div>
    </article>
  );
}

export default ProjectCard;
