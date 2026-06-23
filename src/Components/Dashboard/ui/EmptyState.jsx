export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="db-empty">
      {icon && <div className="db-empty-icon">{icon}</div>}
      <p className="db-empty-title">{title}</p>
      {description && <p className="db-empty-desc">{description}</p>}
      {action && <button className="db-empty-btn" onClick={action.onClick}>{action.label}</button>}
    </div>
  );
}
