import { useMyProjects, useCertificates, useParticipations } from "../../../hooks/useDashboardData";
import ProjectCard from "../cards/ProjectCard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function OverviewView({ currentUser, userData, onNavigate }) {
  const uid = currentUser?.uid;
  const { projects, loading } = useMyProjects(uid);
  const { certificates } = useCertificates(uid);
  const { participations } = useParticipations(uid);

  const name = userData?.name || currentUser?.displayName || "there";
  const active = projects.filter((p) => p.status === "active").length;

  const stats = [
    { label: "Projects", num: projects.length, go: "projects/my" },
    { label: "In progress", num: active, go: "projects/my" },
    { label: "Hackathons", num: participations.length, go: "hackathons/participations" },
    { label: "Certificates", num: certificates.length, go: "certificates/upload" },
  ];

  return (
    <div className="dn-view">
      <div className="dn-hero">
        <div>
          <p className="dn-hero-greet">{getGreeting()}, {name} 👋</p>
          <h1 className="dn-hero-title">Turn your ideas into finished projects</h1>
        </div>
        <button className="dn-btn" onClick={() => onNavigate("projects/create")}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New project
        </button>
      </div>

      <div className="dn-stats">
        {stats.map((s) => (
          <button key={s.label} className="dn-stat" style={{ textAlign: "left", cursor: "pointer", font: "inherit" }} onClick={() => onNavigate(s.go)}>
            <div className="dn-stat-num">{s.num}</div>
            <div className="dn-stat-label">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="dn-view-title-row" style={{ marginBottom: 14 }}>
        <h2 className="dn-section-title" style={{ margin: 0 }}>Recent projects</h2>
        <button className="dn-btn dn-btn-sm" onClick={() => onNavigate("projects/my")}>View all</button>
      </div>

      {loading ? (
        <div className="dn-loading"><div className="dn-spinner" /><p>Loading…</p></div>
      ) : projects.length === 0 ? (
        <div className="dn-empty">
          <div className="dn-empty-ico">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p className="dn-empty-title">No projects yet</p>
          <p className="dn-empty-desc">Create your first project to get started.</p>
          <button className="dn-btn dn-btn-primary" onClick={() => onNavigate("projects/create")}>Create project</button>
        </div>
      ) : (
        <div className="dn-grid">
          {projects.slice(0, 6).map((p) => <ProjectCard key={p.id} item={p} />)}
        </div>
      )}
    </div>
  );
}
