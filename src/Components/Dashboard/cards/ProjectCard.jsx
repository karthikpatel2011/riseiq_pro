import { timeAgo } from "../../../hooks/useDashboardData";

const STATUS_LABEL = { draft: "Draft", active: "In Progress", done: "Completed" };

/**
 * ProjectCard — a card for one of the user's own projects.
 * (Rebuilt for the project-OS model: status + tech tags + links,
 * no more social "join / spots open" mechanics.)
 */
export default function ProjectCard({ item, onEdit, onDelete }) {
  const status = item.status || "active";

  return (
    <div className="dn-card dn-card--hover">
      <div className="dn-proj-head">
        <h3 className="dn-proj-title">{item.title}</h3>
        <span className={`dn-badge dn-badge--${status === "done" ? "done" : status === "draft" ? "draft" : "active"}`}>
          {STATUS_LABEL[status] || "In Progress"}
        </span>
      </div>

      {item.description && <p className="dn-proj-desc">{item.description}</p>}

      {item.tags?.length > 0 && (
        <div className="dn-tags">
          {item.tags.slice(0, 5).map((t) => <span key={t} className="dn-tag">{t}</span>)}
        </div>
      )}

      <div className="dn-proj-foot">
        <span className="dn-proj-meta">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          {timeAgo(item.createdAt) || "just now"}
        </span>
        <div className="dn-proj-actions">
          {item.repoUrl && (
            <a className="dn-icon-btn" href={item.repoUrl} target="_blank" rel="noopener noreferrer" title="Open repository">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          )}
          {onEdit && (
            <button className="dn-icon-btn" onClick={() => onEdit(item)} title="Edit project">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
            </button>
          )}
          {onDelete && (
            <button className="dn-icon-btn dn-icon-btn--danger" onClick={() => onDelete(item)} title="Delete project">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
