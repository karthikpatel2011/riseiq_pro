import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { BRANCHES } from "../ui/BranchFilter";
import { Spinner } from "../ui/Spinner";

export default function CreatePlacementModal({ open, onClose, userId, userName }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [ctc, setCtc] = useState("");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  function resetForm() { setCompany(""); setRole(""); setBranch(""); setCtc(""); setExperienceSummary(""); setError(""); setLoading(false); }

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = prev; };
  }, [open, onClose]);

  useEffect(() => { if (open) resetForm(); }, [open]);

  if (!open) return null;

  function handleOverlayClick(e) { if (e.target === overlayRef.current) onClose(); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!company.trim())           { setError("Company name is required."); return; }
    if (!role.trim())              { setError("Role is required."); return; }
    if (!branch)                   { setError("Please select your branch."); return; }
    if (!experienceSummary.trim()) { setError("Experience summary is required."); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, "placementStories"), {
        authorId: userId, authorName: userName, company: company.trim(),
        role: role.trim(), branch, ctc: ctc.trim() || null,
        experienceSummary: experienceSummary.trim(), createdAt: serverTimestamp(),
      });
      resetForm(); onClose();
    } catch (err) {
      console.error("CreatePlacementModal:", err);
      setError("Failed to share your story. Please try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="am-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="am-modal" role="dialog" aria-modal="true">
        <div className="am-modal-header">
          <h2 className="am-modal-title">Share Placement Story</h2>
          <button className="am-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="am-field">
            <label className="am-label">Company <span aria-hidden="true">*</span></label>
            <div className="am-input-wrap">
              <input className="am-input" type="text" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} disabled={loading} maxLength={100} />
            </div>
          </div>
          <div className="am-field">
            <label className="am-label">Role <span aria-hidden="true">*</span></label>
            <div className="am-input-wrap">
              <input className="am-input" type="text" placeholder="e.g. Software Engineer, Data Analyst…" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} maxLength={100} />
            </div>
          </div>
          <div className="am-field">
            <label className="am-label">Branch <span aria-hidden="true">*</span></label>
            <div className="am-input-wrap">
              <select className="am-input ob-select" value={branch} onChange={(e) => setBranch(e.target.value)} disabled={loading}>
                <option value="">Select your branch…</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="am-field">
            <label className="am-label">CTC <span className="ob-field-hint">(optional)</span></label>
            <div className="am-input-wrap">
              <input className="am-input" type="text" placeholder="e.g. ₹12 LPA (leave blank to keep private)" value={ctc} onChange={(e) => setCtc(e.target.value)} disabled={loading} maxLength={50} />
            </div>
          </div>
          <div className="am-field">
            <label className="am-label">Experience Summary <span aria-hidden="true">*</span></label>
            <div className="am-input-wrap">
              <textarea className="am-input" rows={4} placeholder="Share your interview experience, tips, rounds…" value={experienceSummary} onChange={(e) => setExperienceSummary(e.target.value)} disabled={loading} style={{ resize: "vertical" }} />
            </div>
          </div>
          {error && <p className="ob-field-err">{error}</p>}
          <div className="am-modal-actions">
            <button type="button" className="ob-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="ob-btn-primary" disabled={loading}>
              {loading ? <><Spinner size={16} style={{ marginRight: 6 }} /> Sharing…</> : "Share Story"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
