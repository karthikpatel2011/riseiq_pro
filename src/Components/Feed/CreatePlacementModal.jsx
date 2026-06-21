import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

const BRANCHES = ["CSE", "ECE", "EEE", "IT", "Mechanical", "Civil", "Chemical", "Biotech", "Aerospace", "Other"];

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{
        animation: "am-spin 0.7s linear infinite",
        marginRight: "6px",
        verticalAlign: "middle",
      }}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function CreatePlacementModal({ open, onClose, userId, userName }) {
  const [company,           setCompany]           = useState("");
  const [role,              setRole]              = useState("");
  const [branch,            setBranch]            = useState("");
  const [ctc,               setCtc]               = useState("");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState("");

  const overlayRef = useRef(null);

  function resetForm() {
    setCompany("");
    setRole("");
    setBranch("");
    setCtc("");
    setExperienceSummary("");
    setError("");
    setLoading(false);
  }

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  /* lock body scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  /* reset on open */
  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  if (!open) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

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
        authorId:          userId,
        authorName:        userName,
        company:           company.trim(),
        role:              role.trim(),
        branch,
        ctc:               ctc.trim() || null,
        experienceSummary: experienceSummary.trim(),
        createdAt:         serverTimestamp(),
      });
      resetForm();
      onClose();
    } catch (err) {
      console.error("CreatePlacementModal:", err);
      setError("Failed to share your story. Please try again.");
      setLoading(false);
    }
  }

  const modal = (
    <div className="am-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="am-modal" role="dialog" aria-modal="true" aria-labelledby="cpsm-title">

        {/* header */}
        <div className="am-modal-header">
          <h2 className="am-modal-title" id="cpsm-title">Share Placement Story</h2>
          <button className="am-close" onClick={onClose} aria-label="Close modal">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1"  y2="13" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* company */}
          <div className="am-field">
            <label className="am-label" htmlFor="cpsm-company">
              Company <span aria-hidden="true">*</span>
            </label>
            <div className="am-input-wrap">
              <input
                id="cpsm-company"
                className="am-input"
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={loading}
                maxLength={100}
              />
            </div>
          </div>

          {/* role */}
          <div className="am-field">
            <label className="am-label" htmlFor="cpsm-role">
              Role <span aria-hidden="true">*</span>
            </label>
            <div className="am-input-wrap">
              <input
                id="cpsm-role"
                className="am-input"
                type="text"
                placeholder="e.g. Software Engineer, Data Analyst…"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                maxLength={100}
              />
            </div>
          </div>

          {/* branch */}
          <div className="am-field">
            <label className="am-label" htmlFor="cpsm-branch">
              Branch <span aria-hidden="true">*</span>
            </label>
            <div className="am-input-wrap">
              <select
                id="cpsm-branch"
                className="am-input"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={loading}
              >
                <option value="">Select your branch…</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ctc (optional) */}
          <div className="am-field">
            <label className="am-label" htmlFor="cpsm-ctc">
              CTC <span className="ob-field-hint">(optional)</span>
            </label>
            <div className="am-input-wrap">
              <input
                id="cpsm-ctc"
                className="am-input"
                type="text"
                placeholder="e.g. ₹12 LPA  (leave blank to keep private)"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                disabled={loading}
                maxLength={50}
              />
            </div>
            <span className="ob-field-hint">
              CTC is optional. Leave blank if you prefer to keep it private.
            </span>
          </div>

          {/* experience summary */}
          <div className="am-field">
            <label className="am-label" htmlFor="cpsm-exp">
              Experience Summary <span aria-hidden="true">*</span>
            </label>
            <div className="am-input-wrap">
              <textarea
                id="cpsm-exp"
                className="am-input"
                rows={4}
                placeholder="Share your interview experience, tips, rounds…"
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                disabled={loading}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          {/* error */}
          {error && <p className="ob-field-err">{error}</p>}

          {/* actions */}
          <div className="am-modal-actions">
            <button
              type="button"
              className="ob-btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ob-btn-primary"
              disabled={loading}
            >
              {loading ? <><Spinner />Sharing…</> : "Share Story"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default CreatePlacementModal;
