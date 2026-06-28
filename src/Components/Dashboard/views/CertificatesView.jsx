import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useCertificates } from "../../../hooks/useDashboardData";
import AddCertificateModal from "../modals/AddCertificateModal";

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
);

/** Reusable certificate list (used by Certificates + Hackathons → Certificates). */
export function CertificateList({ uid, filterType, onDelete }) {
  const { certificates, loading } = useCertificates(uid);
  const rows = filterType ? certificates.filter((c) => c.type === filterType) : certificates;

  if (loading) return <div className="dn-loading"><div className="dn-spinner" /><p>Loading certificates…</p></div>;
  if (rows.length === 0) {
    return (
      <div className="dn-empty">
        <div className="dn-empty-ico"><FileIcon /></div>
        <p className="dn-empty-title">No certificates yet</p>
        <p className="dn-empty-desc">Upload your course, hackathon, and internship certificates to build a verified record.</p>
      </div>
    );
  }
  return (
    <div className="dn-list">
      {rows.map((c) => (
        <div key={c.id} className="dn-cert">
          <div className="dn-cert-ico"><FileIcon /></div>
          <div className="dn-cert-body">
            <p className="dn-cert-name">{c.title}</p>
            <p className="dn-cert-issuer">{c.issuer || "—"} · {c.type}</p>
          </div>
          <span className={`dn-badge dn-badge--${c.verified ? "verified" : "pending"}`}>{c.verified ? "Verified" : "Pending"}</span>
          {c.url && (
            <a className="dn-icon-btn" href={c.url} target="_blank" rel="noopener noreferrer" title="View">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
          )}
          {onDelete && (
            <button className="dn-icon-btn dn-icon-btn--danger" onClick={() => onDelete(c)} title="Delete">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CertificatesView({ currentUser, sub = "upload" }) {
  const uid = currentUser?.uid;
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (c) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    await deleteDoc(doc(db, "users", uid, "certificates", c.id));
  };

  const verifiedOnly = sub === "verified";

  return (
    <div className="dn-view">
      <div className="dn-view-head">
        <div className="dn-view-title-row">
          <div>
            <h1 className="dn-view-title">{verifiedOnly ? "Verified certificates" : "Certificates"}</h1>
            <p className="dn-view-sub">{verifiedOnly ? "Certificates confirmed by an issuer or your college." : "Upload and manage all your achievement certificates."}</p>
          </div>
          {!verifiedOnly && (
            <button className="dn-btn dn-btn-primary" onClick={() => setModalOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Upload certificate
            </button>
          )}
        </div>
      </div>

      {verifiedOnly
        ? <CertificateListVerified uid={uid} />
        : <CertificateList uid={uid} onDelete={handleDelete} />}

      <AddCertificateModal open={modalOpen} onClose={() => setModalOpen(false)} userId={uid} />
    </div>
  );
}

/* Verified-only variant */
function CertificateListVerified({ uid }) {
  const { certificates, loading } = useCertificates(uid);
  const rows = certificates.filter((c) => c.verified);
  if (loading) return <div className="dn-loading"><div className="dn-spinner" /><p>Loading…</p></div>;
  if (rows.length === 0) {
    return (
      <div className="dn-empty">
        <div className="dn-empty-ico"><FileIcon /></div>
        <p className="dn-empty-title">No verified certificates yet</p>
        <p className="dn-empty-desc">Once an issuer or your college verifies a certificate, it shows up here.</p>
      </div>
    );
  }
  return (
    <div className="dn-list">
      {rows.map((c) => (
        <div key={c.id} className="dn-cert">
          <div className="dn-cert-ico"><FileIcon /></div>
          <div className="dn-cert-body">
            <p className="dn-cert-name">{c.title}</p>
            <p className="dn-cert-issuer">{c.issuer || "—"} · {c.type}</p>
          </div>
          <span className="dn-badge dn-badge--verified">Verified</span>
        </div>
      ))}
    </div>
  );
}
