import React, { useState, useRef } from "react";

const SKILL_SUGGESTIONS = [
  "Python", "JavaScript", "React", "Node.js", "C++", "Java", "DSA",
  "Machine Learning", "UI/UX", "Figma", "Flutter", "SQL", "MongoDB",
  "Firebase", "AWS", "Docker", "Git", "Embedded Systems", "Arduino",
  "MATLAB", "TypeScript", "Next.js", "FastAPI", "TensorFlow",
];

const INTEREST_OPTIONS = [
  "Web Dev", "AI / ML", "Hardware & IoT", "Mobile Apps",
  "Startups & Entrepreneurship", "Competitive Coding",
  "Cybersecurity", "Blockchain", "Data Science",
  "Open Source", "Research", "Design / UX",
];

function TagInput({ tags, onAdd, onRemove, suggestions, placeholder }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const filtered = input.length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s))
    : [];

  const add = (val) => {
    const trimmed = val.trim();
    if (!trimmed || tags.includes(trimmed)) { setInput(""); return; }
    onAdd(trimmed);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      add(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <div className="ob-taginput" onClick={() => inputRef.current?.focus()}>
      {tags.map(t => (
        <span key={t} className="ob-tag">
          {t}
          <button type="button" className="ob-tag-remove" onClick={() => onRemove(t)} aria-label={`Remove ${t}`}>×</button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="ob-taginput-field"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
      />
      {filtered.length > 0 && (
        <div className="ob-tag-suggestions">
          {filtered.slice(0, 6).map(s => (
            <button key={s} type="button" className="ob-tag-suggest-item" onMouseDown={() => add(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InterestChips({ selected, options, onToggle }) {
  return (
    <div className="ob-chips">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`ob-chip${selected.includes(opt) ? " ob-chip--on" : ""}`}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function Step2Skills({ data, onNext, onBack }) {
  const [skills,    setSkills]    = useState(data.skills    || []);
  const [interests, setInterests] = useState(data.interests || []);
  const [errors,    setErrors]    = useState({});

  const addSkill    = (s) => setSkills(prev => [...prev, s]);
  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const toggleInterest = (i) =>
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (skills.length === 0)    errs.skills    = "Add at least one skill.";
    if (interests.length === 0) errs.interests = "Pick at least one area.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext({ skills, interests });
  };

  return (
    <form className="ob-form" onSubmit={handleSubmit} noValidate>

      <div className="am-field">
        <label className="am-label">YOUR SKILLS <span className="ob-required">*</span></label>
        <p className="ob-field-hint">Type a skill and press Enter or comma. Add custom ones too.</p>
        <TagInput
          tags={skills}
          onAdd={addSkill}
          onRemove={removeSkill}
          suggestions={SKILL_SUGGESTIONS}
          placeholder="e.g. React, Python, DSA…"
        />
        {errors.skills && <span className="ob-field-err">{errors.skills}</span>}
      </div>

      <div className="am-field" style={{ marginTop: "1.75rem" }}>
        <label className="am-label">AREAS OF INTEREST <span className="ob-required">*</span></label>
        <p className="ob-field-hint">What kind of projects and work excites you most?</p>
        <InterestChips selected={interests} options={INTEREST_OPTIONS} onToggle={toggleInterest} />
        {errors.interests && <span className="ob-field-err">{errors.interests}</span>}
      </div>

      <div className="ob-actions ob-actions--two">
        <button type="button" className="ob-btn-ghost" onClick={onBack}>← Back</button>
        <button type="submit" className="ob-btn-primary">Save &amp; Continue →</button>
      </div>

    </form>
  );
}
