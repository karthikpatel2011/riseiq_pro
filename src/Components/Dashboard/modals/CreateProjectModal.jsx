import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Spinner } from "../ui/Spinner";

/* ── Inline tag-input ── */
function TagInput({ tags, onChange, disabled }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  function addTag(raw) {
    const trimmed = raw.trim().replace(/,+$/, "").trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInputValue("");
  }
  function removeTag(index) { onChange(tags.filter((_, i) => i !== index)); }

  function handleKeyDown(e) {
    if (e.key === "Enter") { e.preventDefault(); addTag(inputValue); }
    else if (e.key === ",") { e.preventDefault(); addTag(inputValue); }
    else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) onChange(tags.slice(0, -1));
  }

  return (
    <div className="ob-taginput" onClick={() => inputRef.current?.focus()} style={{ cursor: "text" }}>
      {tags.map((tag, i) => (
        <span className="ob-tag" key={i}>
          {tag}
          <button type="button" className="ob-tag-remove" onClick={(e) => { e.stopPropagation(); removeTag(i); }} disabled={disabled} aria-label={`Remove ${tag}`}>×</button>
        </span>
      ))}
      <input
        ref={inputRef} className="ob-taginput-field" type="text" value={inputValue}
        onChange={(e) => { if (e.target.value.endsWith(",")) addTag(e.target.value); else setInputValue(e.target.value); }}
        onKeyDown={handleKeyDown} onBlur={() => inputValue.trim() && addTag(inputValue)}
        disabled={disabled} placeholder={tags.length === 0 ? "Type a skill and press Enter or comma…" : ""}
      />
    </div>
  );
}

export default function CreateProjectModal({ open, onClose, userId, userName }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [teamSize, setTeamSize] = useState("");
  const [spotsOpen, setSpotsOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  function resetForm() { setTitle(""); setDescription(""); setSkills([]); setTeamSize(""); setSpotsOpen(""); setError(""); setLoading(false); }

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
    if (!title.trim())       { setError("Project title is required."); return; }
    if (!description.trim()) { setError("Project description is required."); return; }
    if (skills.length === 0) { setError("Add at least one required skill."); return; }
    const ts = Number(teamSize), so = Number(spotsOpen);
    if (!teamSize || isNaN(ts) || ts < 2)  { setError("Team size must be at least 2."); return; }
    if (!spotsOpen || isNaN(so) || so < 1) { setError("Spots open must be at least 1."); return; }
    if (so >= ts) { setError("Spots open must be less than total team size."); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, "projects"), {
        authorId: userId, authorName: userName, title: title.trim(),
        description: description.trim(), skillsNeeded: skills,
        teamSize: ts, spotsOpen: so, createdAt: serverTimestamp(),
      });
      resetForm(); onClose();
    } catch (err) {
      console.error("CreateProjectModal:", err);
      setError("Failed to post project. Please try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="am-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="am-modal" role="dialog" aria-modal="true">
        <div className="am-modal-header">
          <h2 className="am-modal-title">Post a Project</h2>
          <button className="am-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="am-field">
            <label className="am-label">Project Title <span aria-hidden="true">*</span></label>
            <div className="am-input-wrap">
              <input className="am-input" type="text" placeholder="What are you building?" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} maxLength={150} />
            </div>
          </div>
          <div className="am-field">
            <label className="am-label">Description <span aria-hidden="true">*</span></label>
            <div className="am-input-wrap">
              <textarea className="am-input" rows={3} placeholder="Describe the project and what problem it solves…" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} style={{ resize: "vertical" }} />
            </div>
          </div>
          <div className="am-field">
            <label className="am-label">Skills Needed <span aria-hidden="true">*</span></label>
            <TagInput tags={skills} onChange={setSkills} disabled={loading} />
            <span className="ob-field-hint">Press Enter or comma after each skill to add it as a tag.</span>
          </div>
          <div className="am-field" style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="am-label">Team Size <span aria-hidden="true">*</span></label>
              <div className="am-input-wrap">
                <input className="am-input" type="number" min={2} max={20} placeholder="Total team size" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} disabled={loading} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="am-label">Spots Open <span aria-hidden="true">*</span></label>
              <div className="am-input-wrap">
                <input className="am-input" type="number" min={1} max={19} placeholder="How many more people?" value={spotsOpen} onChange={(e) => setSpotsOpen(e.target.value)} disabled={loading} />
              </div>
            </div>
          </div>
          {error && <p className="ob-field-err">{error}</p>}
          <div className="am-modal-actions">
            <button type="button" className="ob-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="ob-btn-primary" disabled={loading}>
              {loading ? <><Spinner size={16} style={{ marginRight: 6 }} /> Posting…</> : "Find Teammates"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
