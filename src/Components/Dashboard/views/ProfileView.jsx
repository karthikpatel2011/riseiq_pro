import { useState, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { uploadPhoto, uploadResume } from "../../../lib/cloudinary";
import { useFeed } from "../../../hooks/useFeed";
import Avatar from "../ui/Avatar";
import { Spinner } from "../ui/Spinner";
import DoubtCard from "../cards/DoubtCard";
import ProjectCard from "../cards/ProjectCard";
import PlacementCard from "../cards/PlacementCard";

const BRANCHES = ["CSE", "ECE", "EEE", "IT", "Mechanical", "Civil", "Chemical", "Biotech", "Aerospace", "Other"];
const YEARS = ["1st", "2nd", "3rd", "4th", "5th"];

export default function ProfileView({ currentUser, userData }) {
  const uid = currentUser?.uid;
  const photoRef = useRef(null);
  const resumeRef = useRef(null);

  // Editable fields (initialized from userData)
  const [form, setForm] = useState({
    name: userData?.name || "",
    college: userData?.college || "",
    branch: userData?.branch || "",
    year: userData?.year || "",
    phone: userData?.phone || "",
    skills: userData?.skills || [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [error, setError] = useState("");

  // User's own posts
  const { items: myDoubts, loading: ld } = useFeed("doubts");
  const { items: myProjects, loading: lp } = useFeed("projects");
  const { items: myPlacements, loading: lpl } = useFeed("placements");

  const myDoubtsFiltered = myDoubts.filter((i) => i.authorId === uid);
  const myProjectsFiltered = myProjects.filter((i) => i.authorId === uid);
  const myPlacementsFiltered = myPlacements.filter((i) => i.authorId === uid);

  const totalPosts = myDoubtsFiltered.length + myProjectsFiltered.length + myPlacementsFiltered.length;

  // Handle photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setError("");
    try {
      const url = await uploadPhoto(file, uid);
      await updateDoc(doc(db, "users", uid), { photoURL: url });
    } catch (err) {
      setError("Photo upload failed.");
    }
    setPhotoUploading(false);
  };

  // Handle resume upload
  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true);
    setError("");
    try {
      const url = await uploadResume(file, uid);
      await updateDoc(doc(db, "users", uid), { resumeURL: url });
    } catch (err) {
      setError("Resume upload failed.");
    }
    setResumeUploading(false);
  };

  // Save profile fields
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError("");
    try {
      await updateDoc(doc(db, "users", uid), {
        name: form.name.trim(),
        college: form.college.trim(),
        branch: form.branch,
        year: form.year,
        phone: form.phone.trim(),
        skills: form.skills,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError("Failed to save profile.");
    }
    setSaving(false);
  };

  // Skills tag input
  const [skillInput, setSkillInput] = useState("");
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput("");
  };
  const removeSkill = (idx) => setForm((f) => ({ ...f, skills: f.skills.filter((_, i) => i !== idx) }));

  return (
    <div className="db-view db-view--profile">
      <div className="db-view-head">
        <h2 className="db-view-title">Profile</h2>
      </div>

      <div className="db-profile-grid">
        {/* Left — Photo + stats */}
        <div className="db-profile-sidebar">
          <div className="db-profile-photo-wrap">
            <Avatar src={userData?.photoURL} name={form.name} size={96} />
            <button className="db-profile-photo-btn" onClick={() => photoRef.current?.click()} disabled={photoUploading}>
              {photoUploading ? <><Spinner size={14} /> Uploading…</> : "Change Photo"}
            </button>
            <input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />

            {userData?.resumeURL && (
              <a className="db-profile-resume-link" href={userData.resumeURL} target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                View Resume
              </a>
            )}
            <button className="db-profile-photo-btn" onClick={() => resumeRef.current?.click()} disabled={resumeUploading}>
              {resumeUploading ? <><Spinner size={14} /> Uploading…</> : userData?.resumeURL ? "Update Resume" : "Upload Resume"}
            </button>
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={handleResumeChange} />
          </div>

          <div className="db-profile-stats">
            <div className="db-profile-stat">
              <span className="db-profile-stat-num">{totalPosts}</span>
              <span className="db-profile-stat-label">Posts</span>
            </div>
            <div className="db-profile-stat">
              <span className="db-profile-stat-num">{myDoubtsFiltered.length}</span>
              <span className="db-profile-stat-label">Doubts</span>
            </div>
            <div className="db-profile-stat">
              <span className="db-profile-stat-num">{myProjectsFiltered.length}</span>
              <span className="db-profile-stat-label">Projects</span>
            </div>
          </div>
        </div>

        {/* Right — Edit form */}
        <form className="db-profile-form" onSubmit={handleSave}>
          <div className="db-field">
            <label className="db-field-label">Full Name</label>
            <input className="db-field-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" />
          </div>
          <div className="db-field">
            <label className="db-field-label">College</label>
            <input className="db-field-input" value={form.college} onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))} placeholder="College name" />
          </div>
          <div className="db-field-row">
            <div className="db-field">
              <label className="db-field-label">Branch</label>
              <select className="db-field-input" value={form.branch} onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}>
                <option value="">Select…</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="db-field">
              <label className="db-field-label">Year</label>
              <select className="db-field-input" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}>
                <option value="">Select…</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="db-field">
            <label className="db-field-label">Phone</label>
            <input className="db-field-input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone number" />
          </div>
          <div className="db-field">
            <label className="db-field-label">Skills</label>
            <div className="db-skills-tags">
              {form.skills.map((s, i) => (
                <span key={i} className="db-skill-tag">
                  {s}
                  <button type="button" className="db-skill-remove" onClick={() => removeSkill(i)}>×</button>
                </span>
              ))}
            </div>
            <div className="db-skill-add-row">
              <input className="db-field-input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Type a skill and press Enter" />
              <button type="button" className="db-skill-add-btn" onClick={addSkill}>Add</button>
            </div>
          </div>

          {error && <p className="db-field-err">{error}</p>}
          {saved && <p className="db-field-success">Profile saved!</p>}

          <button type="submit" className="db-profile-save-btn" disabled={saving}>
            {saving ? <><Spinner size={14} /> Saving…</> : "Save Changes"}
          </button>
        </form>
      </div>

      {/* My Posts */}
      <div className="db-my-posts">
        <h3 className="db-my-posts-title">Your Posts</h3>

        {myDoubtsFiltered.length > 0 && (
          <div className="db-my-posts-section">
            <h4 className="db-my-posts-sub">Doubts</h4>
            {myDoubtsFiltered.map((d) => <DoubtCard key={d.id} item={d} currentUser={currentUser} />)}
          </div>
        )}
        {myProjectsFiltered.length > 0 && (
          <div className="db-my-posts-section">
            <h4 className="db-my-posts-sub">Projects</h4>
            {myProjectsFiltered.map((p) => <ProjectCard key={p.id} item={p} currentUser={currentUser} />)}
          </div>
        )}
        {myPlacementsFiltered.length > 0 && (
          <div className="db-my-posts-section">
            <h4 className="db-my-posts-sub">Placement Stories</h4>
            {myPlacementsFiltered.map((p) => <PlacementCard key={p.id} item={p} currentUser={currentUser} />)}
          </div>
        )}
        {totalPosts === 0 && !ld && !lp && !lpl && (
          <p className="db-my-posts-empty">You haven't posted anything yet. Start by asking a doubt!</p>
        )}
      </div>
    </div>
  );
}
