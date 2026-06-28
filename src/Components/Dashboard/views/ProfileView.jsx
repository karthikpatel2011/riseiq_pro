import { useState, useRef } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { uploadPhoto } from "../../../lib/cloudinary";
import Avatar from "../ui/Avatar";
import { Spinner } from "../ui/Spinner";

const BRANCHES = ["CSE", "ECE", "EEE", "IT", "Mechanical", "Civil", "Chemical", "Biotech", "Aerospace", "Other"];
const YEARS = ["1st", "2nd", "3rd", "4th", "5th"];

export default function ProfileView({ currentUser, userData, sub = "personal" }) {
  const uid = currentUser?.uid;
  const navigate = useNavigate();
  const photoRef = useRef(null);

  const [form, setForm] = useState({
    name: userData?.name || "",
    headline: userData?.headline || "",
    phone: userData?.phone || "",
    college: userData?.college || "",
    branch: userData?.branch || "",
    year: userData?.year || "",
    gradYear: userData?.gradYear || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e?.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true); setError("");
    try {
      await updateDoc(doc(db, "users", uid), {
        name: form.name.trim(), headline: form.headline.trim(), phone: form.phone.trim(),
        college: form.college.trim(), branch: form.branch, year: form.year, gradYear: form.gradYear,
      });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch { setError("Couldn't save. Try again."); }
    setSaving(false);
  };

  const onPhoto = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setPhotoUploading(true); setError("");
    try {
      const url = await uploadPhoto(file, uid);
      await updateDoc(doc(db, "users", uid), { photoURL: url });
    } catch { setError("Photo upload failed."); }
    setPhotoUploading(false);
  };

  const logout = async () => { try { await signOut(auth); navigate("/"); } catch (e) { console.error(e); } };

  /* ── Settings ── */
  if (sub === "settings") {
    return (
      <div className="dn-view">
        <div className="dn-view-head">
          <h1 className="dn-view-title">Settings</h1>
          <p className="dn-view-sub">Manage your account.</p>
        </div>
        <div className="dn-card" style={{ maxWidth: 560 }}>
          <div className="dn-field"><label className="dn-field-label">Email</label><input className="dn-input" value={currentUser?.email || ""} disabled /></div>
          <div className="dn-field"><label className="dn-field-label">Account created</label>
            <input className="dn-input" value={currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : "—"} disabled /></div>
          <button className="dn-btn" style={{ color: "#EF4444", borderColor: "#FECACA" }} onClick={logout}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  /* ── Education ── */
  if (sub === "education") {
    return (
      <div className="dn-view">
        <div className="dn-view-head">
          <h1 className="dn-view-title">Education</h1>
          <p className="dn-view-sub">Your college and program details.</p>
        </div>
        <form className="dn-card" style={{ maxWidth: 640 }} onSubmit={save}>
          <div className="dn-field"><label className="dn-field-label">College / University</label>
            <input className="dn-input" value={form.college} onChange={(e) => set("college", e.target.value)} placeholder="Your college" /></div>
          <div className="dn-field-row">
            <div className="dn-field"><label className="dn-field-label">Branch</label>
              <select className="dn-select" value={form.branch} onChange={(e) => set("branch", e.target.value)}>
                <option value="">Select…</option>{BRANCHES.map((b) => <option key={b}>{b}</option>)}
              </select></div>
            <div className="dn-field"><label className="dn-field-label">Current year</label>
              <select className="dn-select" value={form.year} onChange={(e) => set("year", e.target.value)}>
                <option value="">Select…</option>{YEARS.map((y) => <option key={y}>{y}</option>)}
              </select></div>
            <div className="dn-field"><label className="dn-field-label">Graduation year</label>
              <input className="dn-input" type="number" min="2024" max="2035" value={form.gradYear} onChange={(e) => set("gradYear", e.target.value)} placeholder="2027" /></div>
          </div>
          {error && <p className="dn-field-err">{error}</p>}
          {saved && <p className="dn-field-ok">Saved.</p>}
          <button type="submit" className="dn-btn dn-btn-primary" disabled={saving}>{saving ? <><Spinner size={15} /> Saving…</> : "Save changes"}</button>
        </form>
      </div>
    );
  }

  /* ── Personal Info ── */
  return (
    <div className="dn-view">
      <div className="dn-view-head">
        <h1 className="dn-view-title">Personal info</h1>
        <p className="dn-view-sub">This appears on your portfolio and resume.</p>
      </div>
      <form className="dn-card" style={{ maxWidth: 640 }} onSubmit={save}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          <Avatar src={userData?.photoURL} name={form.name} size={72} />
          <div>
            <button type="button" className="dn-btn dn-btn-sm" onClick={() => photoRef.current?.click()} disabled={photoUploading}>
              {photoUploading ? <><Spinner size={14} /> Uploading…</> : "Change photo"}
            </button>
            <input ref={photoRef} type="file" accept="image/*" hidden onChange={onPhoto} />
          </div>
        </div>
        <div className="dn-field"><label className="dn-field-label">Full name</label>
          <input className="dn-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" /></div>
        <div className="dn-field"><label className="dn-field-label">Headline</label>
          <input className="dn-input" value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="CSE undergrad · Full-stack & ML" /></div>
        <div className="dn-field"><label className="dn-field-label">Phone</label>
          <input className="dn-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone number" /></div>
        {error && <p className="dn-field-err">{error}</p>}
        {saved && <p className="dn-field-ok">Saved.</p>}
        <button type="submit" className="dn-btn dn-btn-primary" disabled={saving}>{saving ? <><Spinner size={15} /> Saving…</> : "Save changes"}</button>
      </form>
    </div>
  );
}
