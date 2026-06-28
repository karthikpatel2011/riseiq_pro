import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Spinner } from "../ui/Spinner";

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "In Progress" },
  { value: "done", label: "Completed" },
];

/**
 * CreateProjectModal — create or edit one of the user's projects.
 * Pass `editing` (a project doc) to edit, or `prefill` (from a template) to seed.
 */
export default function CreateProjectModal({ open, onClose, userId, userName, editing, prefill }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("active");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const src = editing || prefill || {};
    setTitle(src.title || "");
    setDescription(src.description || "");
    setTags(src.tags || []);
    setStatus(src.status || "active");
    setRepoUrl(src.repoUrl || "");
    setTagsInput("");
    setError("");
    setLoading(false);

    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = prev; };
  }, [open, editing, prefill, onClose]);

  if (!open) return null;

  function addTag() {
    const t = tagsInput.trim().replace(/,$/, "").trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagsInput("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Project title is required."); return; }
    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        tags,
        status,
        repoUrl: repoUrl.trim(),
      };
      if (editing) {
        await updateDoc(doc(db, "projects", editing.id), payload);
      } else {
        await addDoc(collection(db, "projects"), {
          ...payload,
          authorId: userId,
          authorName: userName,
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err) {
      console.error("CreateProjectModal:", err);
      setError("Couldn't save the project. Try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="dn-modal-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="dn-modal" role="dialog" aria-modal="true">
        <div className="dn-modal-head">
          <h2 className="dn-modal-title">{editing ? "Edit project" : "New project"}</h2>
          <button className="dn-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="dn-modal-body">
            <div className="dn-field">
              <label className="dn-field-label">Project title</label>
              <input className="dn-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Smart attendance system" maxLength={120} disabled={loading} autoFocus />
            </div>
            <div className="dn-field">
              <label className="dn-field-label">Description</label>
              <textarea className="dn-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does it do and what problem does it solve?" disabled={loading} style={{ resize: "vertical" }} />
            </div>
            <div className="dn-field">
              <label className="dn-field-label">Tech / tags</label>
              {tags.length > 0 && (
                <div className="dn-chips">
                  {tags.map((t, i) => (
                    <span key={t} className="dn-chip">{t}
                      <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} aria-label={`Remove ${t}`}>×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="dn-chip-add">
                <input className="dn-input" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                  placeholder="React, then press Enter" disabled={loading} />
                <button type="button" className="dn-btn dn-btn-sm" onClick={addTag} disabled={loading}>Add</button>
              </div>
            </div>
            <div className="dn-field-row">
              <div className="dn-field">
                <label className="dn-field-label">Status</label>
                <select className="dn-select" value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="dn-field">
                <label className="dn-field-label">Repository / demo link</label>
                <input className="dn-input" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/…" disabled={loading} />
              </div>
            </div>
            {error && <p className="dn-field-err">{error}</p>}
          </div>
          <div className="dn-modal-actions">
            <button type="button" className="dn-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="dn-btn dn-btn-primary" disabled={loading}>
              {loading ? <><Spinner size={15} /> Saving…</> : editing ? "Save changes" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
