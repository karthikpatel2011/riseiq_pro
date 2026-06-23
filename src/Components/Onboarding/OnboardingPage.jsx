import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./onboarding.css";
import logo from "../../assets/logo.png";
import onboardingMale from "../../assets/onboarding-male.png";

// Firebase and Cloudinary imports
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { uploadPhoto, uploadResume } from "../../lib/cloudinary";

const STEPS = [
  { n: 1, label: "Basic Information",  sub: "Tell us about yourself" },
  { n: 2, label: "Academic Details",   sub: "Your education information" },
  { n: 3, label: "Skills & Interests", sub: "What are you good at?" },
  { n: 4, label: "Upload Resume",      sub: "Add your resume (optional)" },
  { n: 5, label: "Review & Confirm",   sub: "Verify your details" },
];

const STEP_META = [
  { title: "Let's start with the basics",         sub: "This helps us personalize your experience on RiseIQ." },
  { title: "Tell us about your academics",         sub: "We'll use this to show relevant opportunities." },
  { title: "What are you good at?",               sub: "Add skills and interests to connect with the right people." },
  { title: "Upload your resume",                  sub: "Help teammates and recruiters find you easily." },
  { title: "Review your details",                 sub: "Everything look good? You can edit anytime from settings." },
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"];

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [val, setVal] = useState("");
  const add = () => {
    const t = val.trim();
    if (t && !tags.includes(t)) onAdd(t);
    setVal("");
  };
  return (
    <div className="ob2-tag-input">
      {tags.map(t => (
        <span key={t} className="ob2-tag-chip">
          {t}
          <button type="button" onClick={() => onRemove(t)}>×</button>
        </span>
      ))}
      <input
        className="ob2-tag-field"
        value={val}
        placeholder={tags.length === 0 ? placeholder : ""}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
        onBlur={add}
      />
    </div>
  );
}

export default function OnboardingPage() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const resumeRef = useRef(null);

  const { currentUser, setOnboardingComplete, setUserData } = useAuth();

  const [step,   setStep]   = useState(1);
  const [narrow, setNarrow] = useState(window.innerWidth <= 768);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const prev    = document.body.style.background;
    const prevOvf = document.body.style.overflowX;
    document.body.style.background = "#F8FAFC";
    document.body.style.overflowX  = "hidden";
    const onResize = () => setNarrow(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.background = prev;
      document.body.style.overflowX  = prevOvf;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", dob: "",
    photoFile: null, photoURL: null,
    college: "", branch: "", year: "", cgpa: "",
    skills: [], interests: [], bio: "",
    resumeFile: null, resumeName: "", linkedin: "", github: "", portfolio: "",
  });

  // Pre-fill email from logged-in user if available
  useEffect(() => {
    if (currentUser?.email && !form.email) {
      set("email", currentUser.email);
    }
    if (currentUser?.displayName && !form.fullName) {
      set("fullName", currentUser.displayName);
    }
  }, [currentUser]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const readFile = (file, key) => {
    const reader = new FileReader();
    reader.onload = (ev) => set(key, ev.target.result);
    reader.readAsDataURL(file);
  };

  const handlePhoto = (file) => {
    if (!file) return;
    set("photoFile", file);
    readFile(file, "photoURL");
  };
  const handleResume = (file) => {
    if (!file) return;
    set("resumeFile", file);
    set("resumeName", file.name);
  };

  const validateStep = (currentStep) => {
    const err = {};
    if (currentStep === 1) {
      if (!form.fullName || !form.fullName.trim()) err.fullName = "Full name is required";
      if (!form.email || !form.email.trim()) {
        err.email = "Email address is required";
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        err.email = "Please enter a valid email address";
      }
      if (!form.phone || !form.phone.trim()) {
        err.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
        err.phone = "Must be a valid 10-digit number";
      }
      if (!form.dob || !form.dob.trim()) {
        err.dob = "Date of birth is required";
      }
    } else if (currentStep === 2) {
      if (!form.college || !form.college.trim()) err.college = "College / University is required";
      if (!form.branch || !form.branch.trim()) err.branch = "Branch / Degree is required";
      if (!form.year) err.year = "Year of study is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleFinishOnboarding = async () => {
    if (!currentUser) return;
    setSaving(true);
    setSaveError("");

    try {
      let finalPhotoURL = form.photoURL;
      let finalResumeURL = "";

      // 1. Upload photo to Cloudinary
      if (form.photoFile) {
        try {
          finalPhotoURL = await uploadPhoto(form.photoFile, currentUser.uid);
        } catch (uploadErr) {
          console.error("Photo upload failed", uploadErr);
        }
      }

      // 2. Upload resume to Cloudinary
      if (form.resumeFile) {
        try {
          finalResumeURL = await uploadResume(form.resumeFile, currentUser.uid);
        } catch (uploadErr) {
          console.error("Resume upload failed", uploadErr);
        }
      }

      // 3. Prepare schema
      const profileData = {
        uid: currentUser.uid,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        photoURL: finalPhotoURL || "",
        college: form.college,
        branch: form.branch,
        year: form.year,
        cgpa: form.cgpa,
        skills: form.skills,
        interests: form.interests,
        bio: form.bio,
        resumeName: form.resumeName,
        resumeURL: finalResumeURL || "",
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,
        onboardingComplete: true,
        updatedAt: new Date().toISOString(),
      };

      // 4. Save to Firestore
      await setDoc(doc(db, "users", currentUser.uid), profileData);

      // 5. Update Auth Context states
      setUserData(profileData);
      setOnboardingComplete(true);

      // 6. Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving onboarding details:", err);
      setSaveError("Failed to save profile. Please check your network connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    if (step < 5) {
      if (validateStep(step)) {
        setStep(s => s + 1);
      }
    } else {
      await handleFinishOnboarding();
    }
  };

  const back = () => step > 1 ? setStep(s => s - 1) : navigate("/");

  /* ── STEP FORMS ── */
  const Step1 = (
    <form className="ob2-form" onSubmit={e => e.preventDefault()}>
      <div className="ob2-row">
        <div className="ob2-field">
          <label className="ob2-label">Full Name</label>
          <div className="ob2-input-wrap">
            <input
              className={`ob2-input ${errors.fullName ? "ob2-input--error" : ""}`}
              type="text"
              placeholder="Karthik R."
              value={form.fullName}
              onChange={e => { set("fullName", e.target.value); if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null })); }}
            />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg></span>
          </div>
          {errors.fullName && <span className="ob2-error-msg">{errors.fullName}</span>}
        </div>
        <div className="ob2-field">
          <label className="ob2-label">Email Address</label>
          <div className="ob2-input-wrap">
            <input
              className={`ob2-input ${errors.email ? "ob2-input--error" : ""}`}
              type="email"
              placeholder="karthik.r@example.com"
              value={form.email}
              onChange={e => { set("email", e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: null })); }}
            />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
          </div>
          {errors.email && <span className="ob2-error-msg">{errors.email}</span>}
        </div>
      </div>
      <div className="ob2-row">
        <div className="ob2-field">
          <label className="ob2-label">Phone Number</label>
          <div className={`ob2-input-wrap ob2-input-wrap--phone ${errors.phone ? "ob2-input-wrap--error" : ""}`}>
            <div className="ob2-phone-prefix">
              <span className="ob2-flag">🇮🇳</span><span className="ob2-dial">+91</span>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="10" height="10"><path d="M2 4l4 4 4-4"/></svg>
            </div>
            <input
              className="ob2-input ob2-input--phone"
              type="tel"
              placeholder="98765 43210"
              value={form.phone}
              onChange={e => { set("phone", e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: null })); }}
            />
          </div>
          {errors.phone && <span className="ob2-error-msg">{errors.phone}</span>}
        </div>
        <div className="ob2-field">
          <label className="ob2-label">Date of Birth</label>
          <div className="ob2-input-wrap">
            <input
              className={`ob2-input ${errors.dob ? "ob2-input--error" : ""}`}
              type="text"
              placeholder="DD/MM/YYYY"
              value={form.dob}
              onChange={e => { set("dob", e.target.value); if (errors.dob) setErrors(prev => ({ ...prev, dob: null })); }}
            />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
          </div>
          {errors.dob && <span className="ob2-error-msg">{errors.dob}</span>}
        </div>
      </div>
      <div className="ob2-field ob2-field--full">
        <label className="ob2-label">Profile Picture <span className="ob2-optional">(Optional)</span></label>
        <div className="ob2-upload-row">
          <div className="ob2-dropzone" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handlePhoto(e.dataTransfer.files?.[0]); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5B43E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
            <p className="ob2-drop-main">Click to upload or drag &amp; drop</p>
            <p className="ob2-drop-sub">PNG, JPG or WEBP (Max. 2MB)</p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handlePhoto(e.target.files?.[0])} />
          </div>
          <div className="ob2-preview">
            <span className="ob2-preview-label">Preview</span>
            <div className="ob2-preview-circle">
              {form.photoURL ? <img src={form.photoURL} alt="Preview" className="ob2-preview-img" /> : <svg viewBox="0 0 24 24" fill="none" stroke="#C7D2FE" strokeWidth="1.5" width="32" height="32"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>}
            </div>
          </div>
        </div>
      </div>
    </form>
  );

  const Step2 = (
    <form className="ob2-form" onSubmit={e => e.preventDefault()}>
      <div className="ob2-row">
        <div className="ob2-field">
          <label className="ob2-label">College / University</label>
          <div className="ob2-input-wrap">
            <input
              className={`ob2-input ${errors.college ? "ob2-input--error" : ""}`}
              type="text"
              placeholder="IIT Bombay"
              value={form.college}
              onChange={e => { set("college", e.target.value); if (errors.college) setErrors(prev => ({ ...prev, college: null })); }}
            />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
          </div>
          {errors.college && <span className="ob2-error-msg">{errors.college}</span>}
        </div>
        <div className="ob2-field">
          <label className="ob2-label">Branch / Degree</label>
          <div className="ob2-input-wrap">
            <input
              className={`ob2-input ${errors.branch ? "ob2-input--error" : ""}`}
              type="text"
              placeholder="B.Tech Computer Science"
              value={form.branch}
              onChange={e => { set("branch", e.target.value); if (errors.branch) setErrors(prev => ({ ...prev, branch: null })); }}
            />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></span>
          </div>
          {errors.branch && <span className="ob2-error-msg">{errors.branch}</span>}
        </div>
      </div>
      <div className="ob2-row">
        <div className="ob2-field">
          <label className="ob2-label">Year of Study</label>
          <div className="ob2-input-wrap ob2-input-wrap--select">
            <select
              className={`ob2-select ${errors.year ? "ob2-input--error" : ""}`}
              value={form.year}
              onChange={e => { set("year", e.target.value); if (errors.year) setErrors(prev => ({ ...prev, year: null })); }}
            >
              <option value="">Select year</option>
              {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
          </div>
          {errors.year && <span className="ob2-error-msg">{errors.year}</span>}
        </div>
        <div className="ob2-field">
          <label className="ob2-label">CGPA / Percentage <span className="ob2-optional">(Optional)</span></label>
          <div className="ob2-input-wrap">
            <input className="ob2-input" type="text" placeholder="8.5 / 85%" value={form.cgpa} onChange={e => set("cgpa", e.target.value)} />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span>
          </div>
        </div>
      </div>
    </form>
  );

  const Step3 = (
    <form className="ob2-form" onSubmit={e => e.preventDefault()}>
      <div className="ob2-field ob2-field--full">
        <label className="ob2-label">Skills <span className="ob2-optional">(Press Enter or comma to add)</span></label>
        <TagInput tags={form.skills} onAdd={t => set("skills", [...form.skills, t])} onRemove={t => set("skills", form.skills.filter(s => s !== t))} placeholder="e.g. React, Python, UI/UX…" />
      </div>
      <div className="ob2-field ob2-field--full">
        <label className="ob2-label">Interests <span className="ob2-optional">(Press Enter or comma to add)</span></label>
        <TagInput tags={form.interests} onAdd={t => set("interests", [...form.interests, t])} onRemove={t => set("interests", form.interests.filter(i => i !== t))} placeholder="e.g. Machine Learning, Open Source…" />
      </div>
      <div className="ob2-field ob2-field--full">
        <label className="ob2-label">Bio <span className="ob2-optional">(Optional)</span></label>
        <textarea className="ob2-textarea" rows={4} placeholder="Tell us a little about yourself — your goals, projects you love, or what you're looking for on RiseIQ." value={form.bio} onChange={e => set("bio", e.target.value)} />
      </div>
    </form>
  );

  const Step4 = (
    <form className="ob2-form" onSubmit={e => e.preventDefault()}>
      <div className="ob2-field ob2-field--full">
        <label className="ob2-label">Resume <span className="ob2-optional">(Optional — PDF or DOC, Max. 5MB)</span></label>
        <div className="ob2-dropzone ob2-dropzone--resume" onClick={() => resumeRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleResume(e.dataTransfer.files?.[0]); }}>
          {form.resumeName ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              <p className="ob2-drop-main" style={{ color: "#22C55E" }}>{form.resumeName}</p>
              <p className="ob2-drop-sub">Click to replace</p>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="#5B43E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
              <p className="ob2-drop-main">Click to upload or drag &amp; drop</p>
              <p className="ob2-drop-sub">PDF or DOC (Max. 5MB)</p>
            </>
          )}
          <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => handleResume(e.target.files?.[0])} />
        </div>
      </div>
      <div className="ob2-row">
        <div className="ob2-field">
          <label className="ob2-label">LinkedIn URL <span className="ob2-optional">(Optional)</span></label>
          <div className="ob2-input-wrap">
            <input className="ob2-input" type="url" placeholder="https://linkedin.com/in/yourname" value={form.linkedin} onChange={e => set("linkedin", e.target.value)} />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></span>
          </div>
        </div>
        <div className="ob2-field">
          <label className="ob2-label">GitHub URL <span className="ob2-optional">(Optional)</span></label>
          <div className="ob2-input-wrap">
            <input className="ob2-input" type="url" placeholder="https://github.com/yourname" value={form.github} onChange={e => set("github", e.target.value)} />
            <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg></span>
          </div>
        </div>
      </div>
      <div className="ob2-field ob2-field--full">
        <label className="ob2-label">Portfolio URL <span className="ob2-optional">(Optional)</span></label>
        <div className="ob2-input-wrap">
          <input className="ob2-input" type="url" placeholder="https://yourportfolio.com" value={form.portfolio} onChange={e => set("portfolio", e.target.value)} />
          <span className="ob2-input-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></span>
        </div>
      </div>
    </form>
  );

  const ReviewRow = ({ label, value }) => (
    <div className="ob2-rv-row">
      <span className="ob2-rv-label">{label}</span>
      <span className="ob2-rv-value">{value || <span className="ob2-rv-empty">Not provided</span>}</span>
    </div>
  );

  const Step5 = (
    <div className="ob2-review">
      <div className="ob2-rv-section">
        <div className="ob2-rv-head">
          <span className="ob2-rv-title">Basic Information</span>
          <button type="button" className="ob2-rv-edit" onClick={() => setStep(1)} disabled={saving}>Edit</button>
        </div>
        <ReviewRow label="Full Name"  value={form.fullName} />
        <ReviewRow label="Email"      value={form.email} />
        <ReviewRow label="Phone"      value={form.phone ? `+91 ${form.phone}` : ""} />
        <ReviewRow label="Date of Birth" value={form.dob} />
        {form.photoURL && <div className="ob2-rv-row"><span className="ob2-rv-label">Profile Picture</span><img src={form.photoURL} alt="profile" className="ob2-rv-photo"/></div>}
      </div>
      <div className="ob2-rv-section">
        <div className="ob2-rv-head">
          <span className="ob2-rv-title">Academic Details</span>
          <button type="button" className="ob2-rv-edit" onClick={() => setStep(2)} disabled={saving}>Edit</button>
        </div>
        <ReviewRow label="College"  value={form.college} />
        <ReviewRow label="Branch"   value={form.branch} />
        <ReviewRow label="Year"     value={form.year} />
        <ReviewRow label="CGPA"     value={form.cgpa} />
      </div>
      <div className="ob2-rv-section">
        <div className="ob2-rv-head">
          <span className="ob2-rv-title">Skills &amp; Interests</span>
          <button type="button" className="ob2-rv-edit" onClick={() => setStep(3)} disabled={saving}>Edit</button>
        </div>
        <ReviewRow label="Skills"    value={form.skills.join(", ")} />
        <ReviewRow label="Interests" value={form.interests.join(", ")} />
        <ReviewRow label="Bio"       value={form.bio} />
      </div>
      <div className="ob2-rv-section">
        <div className="ob2-rv-head">
          <span className="ob2-rv-title">Resume &amp; Links</span>
          <button type="button" className="ob2-rv-edit" onClick={() => setStep(4)} disabled={saving}>Edit</button>
        </div>
        <ReviewRow label="Resume"    value={form.resumeName} />
        <ReviewRow label="LinkedIn"  value={form.linkedin} />
        <ReviewRow label="GitHub"    value={form.github} />
        <ReviewRow label="Portfolio" value={form.portfolio} />
      </div>
      {saveError && (
        <div style={{
          background: "#FEE2E2",
          color: "#EF4444",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: 600,
          marginTop: "16px",
          textAlign: "center"
        }}>
          {saveError}
        </div>
      )}
    </div>
  );

  const steps = [Step1, Step2, Step3, Step4, Step5];

  return (
    <div className="ob2-root">

      {!narrow && <aside className="ob2-left">
        <div className="ob2-left-top">
          <img src={logo} alt="RiseIQ" className="ob2-logo" />
          <h2 className="ob2-welcome">Welcome to RiseIQ 👋</h2>
          <p className="ob2-welcome-sub">Let's complete your profile setup so we can personalize your experience.</p>
          <ol className="ob2-steps">
            {STEPS.map(s => (
              <li key={s.n} className={`ob2-step${s.n === step ? " ob2-step--active" : s.n < step ? " ob2-step--done" : ""}`}>
                <div className="ob2-step-bullet">
                  {s.n < step
                    ? <svg viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,7 5.5,11 12,3"/></svg>
                    : s.n}
                </div>
                <div className="ob2-step-text">
                  <span className="ob2-step-label">{s.label}</span>
                  <span className="ob2-step-sub">{s.sub}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="ob2-safety">
          <div className="ob2-safety-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5B43E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>
          </div>
          <div>
            <p className="ob2-safety-title">Your data is safe with us</p>
            <p className="ob2-safety-desc">We never share your personal information with anyone.</p>
          </div>
        </div>
      </aside>}

      <main className="ob2-right">
        <div className="ob2-topbar">
          <button className="ob2-help">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Need help?
          </button>
        </div>

        <div className="ob2-card">
          <div className="ob2-card-head">
            <div className="ob2-card-head-left">
              <span className="ob2-step-pill">Step {step} of 5</span>
              <h1 className="ob2-card-title">{STEP_META[step - 1].title}</h1>
              <p className="ob2-card-sub">{STEP_META[step - 1].sub}</p>
            </div>
            <div className="ob2-illus-wrap">
              <img src={onboardingMale} alt="RiseIQ student" className="ob2-illus-img" />
            </div>
          </div>

          {steps[step - 1]}

          <div className="ob2-info-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5B43E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            You can update all these details later from your profile settings.
          </div>
        </div>

        <div className="ob2-bottom">
          <button className="ob2-skip" onClick={step === 1 ? () => navigate("/") : back} disabled={saving}>
            {step === 1 ? "← Back to Home" : "← Back"}
          </button>
          <button className="ob2-continue" onClick={next} disabled={saving}>
            {saving ? (
              "Saving..."
            ) : step === 5 ? (
              "Confirm & Finish"
            ) : (
              "Continue"
            )}
            {!saving && (
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
