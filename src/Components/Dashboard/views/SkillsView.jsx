import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function SkillsView({ currentUser, userData, sub = "my" }) {
  const uid = currentUser?.uid;
  const skills = userData?.skills || [];
  const progress = userData?.skillProgress || {};
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (patch) => {
    if (!uid) return;
    setSaving(true);
    try { await updateDoc(doc(db, "users", uid), patch); } catch (e) { console.error(e); }
    setSaving(false);
  };

  const addSkill = () => {
    const s = input.trim();
    if (!s || skills.includes(s)) { setInput(""); return; }
    save({ skills: [...skills, s] });
    setInput("");
  };
  const removeSkill = (s) => {
    const next = skills.filter((x) => x !== s);
    const np = { ...progress }; delete np[s];
    save({ skills: next, skillProgress: np });
  };
  const setProgress = (s, val) => save({ skillProgress: { ...progress, [s]: Number(val) } });

  /* ── Skill Progress ── */
  if (sub === "progress") {
    return (
      <div className="dn-view">
        <div className="dn-view-head">
          <h1 className="dn-view-title">Skill progress</h1>
          <p className="dn-view-sub">Track how far along you are with each skill.</p>
        </div>
        {skills.length === 0 ? (
          <div className="dn-empty">
            <div className="dn-empty-ico"><BoltIcon /></div>
            <p className="dn-empty-title">Add skills first</p>
            <p className="dn-empty-desc">Add skills under “My Skills”, then set your progress for each.</p>
          </div>
        ) : (
          <div className="dn-card">
            {skills.map((s) => (
              <div key={s} className="dn-skill-row">
                <span className="dn-skill-name">{s}</span>
                <input className="dn-skill-range" type="range" min="0" max="100" step="5"
                  value={progress[s] ?? 0} onChange={(e) => setProgress(s, e.target.value)} />
                <div className="dn-bar"><div className="dn-bar-fill" style={{ width: `${progress[s] ?? 0}%` }} /></div>
                <span className="dn-skill-pct">{progress[s] ?? 0}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── My Skills ── */
  return (
    <div className="dn-view">
      <div className="dn-view-head">
        <h1 className="dn-view-title">My skills</h1>
        <p className="dn-view-sub">The technologies and tools you work with.{saving ? " · saving…" : ""}</p>
      </div>
      <div className="dn-card" style={{ maxWidth: 640 }}>
        {skills.length > 0 ? (
          <div className="dn-chips">
            {skills.map((s) => (
              <span key={s} className="dn-chip">{s}
                <button type="button" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>×</button>
              </span>
            ))}
          </div>
        ) : (
          <p className="dn-view-sub" style={{ margin: "0 0 12px" }}>No skills yet. Add your first one below.</p>
        )}
        <div className="dn-chip-add" style={{ marginTop: 8 }}>
          <input className="dn-input" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
            placeholder="e.g. React, Python, Figma — press Enter" />
          <button className="dn-btn dn-btn-primary" onClick={addSkill}>Add</button>
        </div>
      </div>
    </div>
  );
}

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
