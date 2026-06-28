import { useEffect } from "react";
import { useMyProjects, useCertificates } from "../../../hooks/useDashboardData";

export default function ResumeView({ currentUser, userData, sub = "auto" }) {
  const uid = currentUser?.uid;
  const { projects } = useMyProjects(uid);
  const { certificates } = useCertificates(uid);

  const name = userData?.name || currentUser?.displayName || "Your name";
  const skills = userData?.skills || [];
  const shownProjects = projects.filter((p) => p.status !== "draft");

  // "Download PDF" nav item triggers the browser print-to-PDF dialog.
  useEffect(() => {
    if (sub === "download") {
      const t = setTimeout(() => window.print(), 350);
      return () => clearTimeout(t);
    }
  }, [sub]);

  return (
    <div className="dn-view">
      <div className="dn-view-head">
        <div className="dn-view-title-row">
          <div>
            <h1 className="dn-view-title">Resume</h1>
            <p className="dn-view-sub">Generated from your profile, projects, and certificates.</p>
          </div>
          <button className="dn-btn dn-btn-primary dn-no-print" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
        </div>
      </div>

      <div className="dn-sheet dn-print-area">
        <h2 className="dn-sheet-name">{name}</h2>
        <p className="dn-sheet-tagline">{userData?.headline || "Student"}</p>
        <div className="dn-sheet-contact">
          {currentUser?.email && <span>{currentUser.email}</span>}
          {userData?.phone && <span>{userData.phone}</span>}
          {userData?.college && <span>{userData.college}</span>}
        </div>

        <div className="dn-sheet-section">
          <h3 className="dn-sheet-h">Education</h3>
          <div className="dn-sheet-item">
            <p className="dn-sheet-item-title">{userData?.college || "—"}</p>
            <p className="dn-sheet-item-sub">
              {[userData?.branch, userData?.year && `${userData.year} year`, userData?.gradYear && `Graduating ${userData.gradYear}`].filter(Boolean).join(" · ") || "Add education in Profile"}
            </p>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="dn-sheet-section">
            <h3 className="dn-sheet-h">Skills</h3>
            <p className="dn-sheet-item-desc">{skills.join(", ")}</p>
          </div>
        )}

        <div className="dn-sheet-section">
          <h3 className="dn-sheet-h">Projects</h3>
          {shownProjects.length === 0 ? (
            <p className="dn-sheet-item-sub">No projects yet — add some under Projects.</p>
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
            <h3 className="dn-sheet-h">Certifications</h3>
            {certificates.map((c) => (
              <div key={c.id} className="dn-sheet-item">
                <p className="dn-sheet-item-title">{c.title}{c.verified ? " ✓" : ""}</p>
                <p className="dn-sheet-item-sub">{c.issuer || "—"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
