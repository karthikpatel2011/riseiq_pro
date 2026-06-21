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

function CreateDoubtModal({ open, onClose, userId, userName }) {
  const [title,   setTitle]   = useState("");
  const [subject, setSubject] = useState("");
  const [branch,  setBranch]  = useState("");
  const [body,    setBody]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const overlayRef = useRef(null);

  /* reset form state */
  function resetForm() {
    setTitle("");
    setSubject("");
    setBranch("");
    setBody("");
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

  /* lock body scroll while open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  /* reset when modal is opened */
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

    if (!title.trim())   { setError("Question title is required."); return; }
    if (!subject.trim()) { setError("Subject is required."); return; }
    if (!branch)         { setError("Please select your branch."); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, "doubts"), {
        authorId:      userId,
        authorName:    userName,
        authorPhotoURL: "",
        title:         title.trim(),
        body:          body.trim(),
        subject:       subject.trim(),
        branch,
        answerCount:   0,
        createdAt:     serverTimestamp(),
      });
      resetForm();
      onClose();
    } catch (err) {
      console.error("CreateDoubtModal:", err);
      setError("Failed to post your question. Please try again.");
      setLoading(false);
    }
  }

  const modal = (
    <div className="am-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="am-modal" role="dialog" aria-modal="true" aria-labelledby="cdm-title">

        {/* header */}
        <div className="am-modal-header">
          <h2 className="am-modal-title" id="cdm-title">Ask a Doubt</h2>
          <button className="am-close" onClick={onClose} aria-label="Close modal">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1"  y2="13" />
            </svg>
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* title */}
          <div className="am-field">
            <label className="am-label" htmlFor="cdm-title-input">
              Question Title <span aria-hidden="true">*</span>
            </label>
            <div className="am-input-wrap">
              <input
                id="cdm-title-input"
                className="am-input"
                type="text"
                placeholder="What's your question? Be specific."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                maxLength={200}
              />
            </div>
          </div>

          {/* subject */}
          <div className="am-field">
            <label className="am-label" htmlFor="cdm-subject">
              Subject <span aria-hidden="true">*</span>
            </label>
            <div className="am-input-wrap">
              <input
                id="cdm-subject"
                className="am-input"
                type="text"
                placeholder="e.g. Operating Systems, Machine Learning…"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                maxLength={100}
              />
            </div>
          </div>

          {/* branch */}
          <div className="am-field">
            <label className="am-label" htmlFor="cdm-branch">
              Branch <span aria-hidden="true">*</span>
            </label>
            <div className="am-input-wrap">
              <select
                id="cdm-branch"
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

          {/* body (optional) */}
          <div className="am-field">
            <label className="am-label" htmlFor="cdm-body">
              Additional Context <span className="ob-field-hint">(optional)</span>
            </label>
            <div className="am-input-wrap">
              <textarea
                id="cdm-body"
                className="am-input"
                rows={4}
                placeholder="Add more context, what you've tried, error messages…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
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
              {loading ? <><Spinner />Posting…</> : "Post Question"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default CreateDoubtModal;
