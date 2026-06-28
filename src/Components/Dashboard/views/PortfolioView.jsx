import { useState } from "react";
import { useMyProjects, useCertificates } from "../../../hooks/useDashboardData";
import Avatar from "../ui/Avatar";

export default function PortfolioView({ currentUser, userData, sub = "page" }) {
  const uid = currentUser?.uid;
  const { projects } = useMyProjects(uid);
  const { certificates } = useCertificates(uid);
  const [copied, setCopied] = useState(false);

  const name = userData?.name || currentUser?.displayName || "Your name";
  const skills = userData?.skills || [];
  const shownProjects = projects.filter((p) => p.status !== "draft");

  const shareLink = `${window.location.origin}/u/${uid}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard blocked */ }
  };

  const Sheet = (
    <div className="dn-sheet dn-print-area">
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Avatar src={userData?.photoURL} name={name} size={72} />
        <div>
          <h2 className="dn-sheet-name">{name}</h2>
          <p className="dn-sheet-tagline">{userData?.headline || "Student builder on RiseIQ"}</p>
          <div className="dn-sheet-contact">
            {currentUser?.email && <span>{currentUser.email}</span>}
            {userData?.college && <span>{userData.college}</span>}
            {userData?.branch && <span>{userData.branch}{userData?.year ? ` · ${userData.year} year` : ""}</span>}
          </div>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="dn-sheet-section">
          <h3 className="dn-sheet-h">Skills</h3>
          <div className="dn-tags">{skills.map((s) => <span key={s} className="dn-tag">{s}</span>)}</div>
        </div>
      )}

      <div className="dn-sheet-section">
        <h3 className="dn-sheet-h">Projects</h3>
        {shownProjects.length === 0 ? (
          <p className="dn-sheet-item-sub">No published projects yet.</p>
        ) : shownProjects.map((p) => (
          <div key={p.id} className="dn-sheet-item">
            <p className="dn-sheet-item-title">{p.title}</p>
            {p.tags?.length > 0 && <p className="dn-sheet-item-sub">{p.tags.join(" · ")}</p>}
            {p.description && <p className="dn-sheet-item-desc">{p.description}</p>}
          </div>
        ))}
      </div>

      {certificates.length > 0 && (
        <div className="dn-sheet-section">
          <h3 className="dn-sheet-h">Certificates</h3>
          {certificates.map((c) => (
            <div key={c.id} className="dn-sheet-item">
              <p className="dn-sheet-item-title">{c.title}{c.verified ? " ✓" : ""}</p>
              <p className="dn-sheet-item-sub">{c.issuer || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ── Share ── */
  if (sub === "share") {
    return (
      <div className="dn-view">
        <div className="dn-view-head">
          <h1 className="dn-view-title">Share portfolio</h1>
          <p className="dn-view-sub">Send a link or export your portfolio as a PDF.</p>
        </div>
        <div className="dn-card" style={{ maxWidth: 560, marginBottom: 22 }}>
          <label className="dn-field-label">Your portfolio link</label>
          <div className="dn-chip-add">
            <input className="dn-input" value={shareLink} readOnly onFocus={(e) => e.target.select()} />
            <button className="dn-btn dn-btn-primary" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
          </div>
          <p className="dn-view-sub" style={{ marginTop: 10 }}>
            Public sharing pages go live with the backend rollout. For now, use “Print / Save as PDF” to share a file.
          </p>
          <button className="dn-btn" style={{ marginTop: 12 }} onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print / Save as PDF
          </button>
        </div>
        {Sheet}
      </div>
    );
  }

  /* ── Portfolio Page ── */
  return (
    <div className="dn-view">
      <div className="dn-view-head">
        <div className="dn-view-title-row">
          <div>
            <h1 className="dn-view-title">Portfolio</h1>
            <p className="dn-view-sub">Auto-built from your projects, skills, and certificates.</p>
          </div>
          <button className="dn-btn dn-no-print" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Export PDF
          </button>
        </div>
      </div>
      {Sheet}
    </div>
  );
}
