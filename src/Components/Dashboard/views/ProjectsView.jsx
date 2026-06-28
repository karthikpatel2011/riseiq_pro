import { useState, useEffect } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useMyProjects } from "../../../hooks/useDashboardData";
import { PROJECT_TEMPLATES } from "../data/seed";
import ProjectCard from "../cards/ProjectCard";
import CreateProjectModal from "../modals/CreateProjectModal";

export default function ProjectsView({ currentUser, userData, sub = "my" }) {
  const uid = currentUser?.uid;
  const userName = userData?.name || currentUser?.displayName || "User";
  const { projects, loading } = useMyProjects(uid);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [prefill, setPrefill] = useState(null);

  // "Create Project" nav item opens the modal directly.
  useEffect(() => {
    if (sub === "create") { setEditing(null); setPrefill(null); setModalOpen(true); }
  }, [sub]);

  const openCreate = () => { setEditing(null); setPrefill(null); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setPrefill(null); setModalOpen(true); };
  const applyTemplate = (t) => { setEditing(null); setPrefill({ title: t.title, description: t.description, tags: t.tags, status: "draft" }); setModalOpen(true); };
  const handleDelete = async (p) => { if (confirm(`Delete "${p.title}"?`)) await deleteDoc(doc(db, "projects", p.id)); };

  const modal = (
    <CreateProjectModal
      open={modalOpen}
      onClose={() => { setModalOpen(false); setEditing(null); setPrefill(null); }}
      userId={uid} userName={userName} editing={editing} prefill={prefill}
    />
  );

  /* ── Templates ── */
  if (sub === "templates") {
    return (
      <div className="dn-view">
        <div className="dn-view-head">
          <h1 className="dn-view-title">Project templates</h1>
          <p className="dn-view-sub">Start from a proven stack instead of a blank page.</p>
        </div>
        <div className="dn-grid">
          {PROJECT_TEMPLATES.map((t) => (
            <div key={t.id} className="dn-card dn-card--hover">
              <h3 className="dn-proj-title">{t.title}</h3>
              <p className="dn-proj-desc">{t.description}</p>
              <div className="dn-tags" style={{ marginBottom: 16 }}>
                {t.tags.map((tag) => <span key={tag} className="dn-tag">{tag}</span>)}
              </div>
              <button className="dn-btn dn-btn-primary dn-btn-sm" onClick={() => applyTemplate(t)}>Use template</button>
            </div>
          ))}
        </div>
        {modal}
      </div>
    );
  }

  /* ── My Projects (and Create, which just opens the modal over this list) ── */
  return (
    <div className="dn-view">
      <div className="dn-view-head">
        <div className="dn-view-title-row">
          <div>
            <h1 className="dn-view-title">My projects</h1>
            <p className="dn-view-sub">Everything you're building, in one place.</p>
          </div>
          <button className="dn-btn dn-btn-primary" onClick={openCreate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="dn-loading"><div className="dn-spinner" /><p>Loading projects…</p></div>
      ) : projects.length === 0 ? (
        <div className="dn-empty">
          <div className="dn-empty-ico">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p className="dn-empty-title">Start your first project</p>
          <p className="dn-empty-desc">Create a project to track what you're building — or start from a template.</p>
          <button className="dn-btn dn-btn-primary" onClick={openCreate}>Create project</button>
        </div>
      ) : (
        <div className="dn-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} item={p} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {modal}
    </div>
  );
}
