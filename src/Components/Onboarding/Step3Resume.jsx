import React, { useState, useRef } from "react";
import { uploadPhoto, uploadResume } from "../../lib/cloudinary";

const MAX_MB = 5;
const MAX_B  = MAX_MB * 1024 * 1024;

function UploadZone({ label, hint, accept, onUploaded, currentURL, typeLabel, doUpload }) {
  const inputRef              = useRef(null);
  const [progress, setProgress] = useState(null); // 0-100 while uploading, null otherwise
  const [error,    setError]    = useState("");
  const [done,     setDone]     = useState(!!currentURL);
  const [preview,  setPreview]  = useState(currentURL || "");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");

    // client-side type/size check
    const isImage = file.type.startsWith("image/");
    const isPDF   = file.type === "application/pdf";

    if (typeLabel === "Photo" && !isImage) {
      setError("Please upload an image file (JPG, PNG, WebP…).");
      return;
    }
    if (typeLabel === "PDF" && !isPDF) {
      setError("Resume must be a PDF file.");
      return;
    }
    if (file.size > MAX_B) {
      setError(`File must be under ${MAX_MB} MB.`);
      return;
    }

    // local preview for photos
    if (isImage) setPreview(URL.createObjectURL(file));

    setProgress(0);
    try {
      const url = await doUpload(file, (pct) => setProgress(pct));
      onUploaded(url);
      setDone(true);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
      setPreview("");
    } finally {
      setProgress(null);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const triggerPick = () => { if (progress === null) inputRef.current?.click(); };

  return (
    <div className="ob-upload-zone">
      <p className="am-label">{label}</p>
      <p className="ob-field-hint">{hint}</p>

      <div
        className={`ob-dropzone${done ? " ob-dropzone--done" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={triggerPick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && triggerPick()}
      >
        {/* Photo preview */}
        {preview && typeLabel === "Photo" ? (
          <div className="ob-photo-wrap">
            <img src={preview} alt="Profile preview" className="ob-photo-preview" />
            {done && (
              <button
                type="button"
                className="ob-dropzone-change"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                Change
              </button>
            )}
          </div>
        ) : progress !== null ? (
          /* Upload progress */
          <div className="ob-dropzone-uploading">
            <div className="ob-upload-bar">
              <div className="ob-upload-fill" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%  uploading…</span>
          </div>
        ) : done ? (
          /* Done state */
          <div className="ob-dropzone-done">
            <span className="ob-dropzone-check">✓</span>
            <span>{typeLabel} uploaded</span>
            <button
              type="button"
              className="ob-dropzone-change"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              Change
            </button>
          </div>
        ) : (
          /* Empty state */
          <div className="ob-dropzone-empty">
            <span className="ob-dropzone-icon">↑</span>
            <span>Drag &amp; drop or <u>browse</u></span>
            <span className="ob-dropzone-meta">{typeLabel} · max {MAX_MB} MB</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {error && <span className="ob-field-err">{error}</span>}
    </div>
  );
}

export default function Step3Resume({ data, userId, onNext, onBack }) {
  const [photoURL,  setPhotoURL]  = useState(data.photoURL  || "");
  const [resumeURL, setResumeURL] = useState(data.resumeURL || "");
  const [project,   setProject]   = useState(
    data.project || { title: "", description: "", link: "" }
  );
  const [errors, setErrors] = useState({});

  const setP = (key) => (e) => setProject((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!resumeURL) errs.resume = "Please upload your resume (PDF) to continue.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext({ photoURL, resumeURL, project });
  };

  return (
    <form className="ob-form" onSubmit={handleSubmit} noValidate>

      <div className="ob-upload-row">
        {/* ── Profile photo ── */}
        <UploadZone
          label="PROFILE PHOTO"
          hint="A clear photo helps build trust with co-founders and mentors."
          accept="image/*"
          onUploaded={setPhotoURL}
          currentURL={photoURL}
          typeLabel="Photo"
          doUpload={(file, onProg) => uploadPhoto(file, userId, onProg)}
        />

        {/* ── Resume PDF ── */}
        <div className="ob-upload-zone">
          <UploadZone
            label="RESUME (PDF) *"
            hint="Stored securely on Cloudinary CDN — only shared when you choose."
            accept=".pdf,application/pdf"
            onUploaded={setResumeURL}
            currentURL={resumeURL}
            typeLabel="PDF"
            doUpload={(file, onProg) => uploadResume(file, userId, onProg)}
          />
          {errors.resume && <span className="ob-field-err">{errors.resume}</span>}
        </div>
      </div>

      {/* ── First portfolio item (optional) ── */}
      <div className="ob-project-section">
        <p className="am-label">
          ADD YOUR FIRST PROJECT / CERTIFICATE
          <span className="ob-optional"> (optional)</span>
        </p>
        <p className="ob-field-hint">
          This becomes the seed of your Verified Skill Resume. You can add more later.
        </p>

        <div className="ob-field-grid">
          <div className="am-field ob-field--full">
            <label className="am-label">TITLE</label>
            <div className="am-input-wrap">
              <input
                className="am-input"
                type="text"
                placeholder="e.g. Smart Attendance System"
                value={project.title}
                onChange={setP("title")}
              />
            </div>
          </div>

          <div className="am-field ob-field--full">
            <label className="am-label">SHORT DESCRIPTION</label>
            <div className="am-input-wrap">
              <textarea
                className="am-input ob-textarea"
                rows={3}
                placeholder="What did you build / achieve? (2–3 sentences)"
                value={project.description}
                onChange={setP("description")}
              />
            </div>
          </div>

          <div className="am-field ob-field--full">
            <label className="am-label">
              LINK
              <span className="ob-optional"> (GitHub, demo, certificate URL…)</span>
            </label>
            <div className="am-input-wrap">
              <input
                className="am-input"
                type="url"
                placeholder="https://"
                value={project.link}
                onChange={setP("link")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ob-actions ob-actions--two">
        <button type="button" className="ob-btn-ghost" onClick={onBack}>← Back</button>
        <button type="submit" className="ob-btn-primary">Save &amp; Continue →</button>
      </div>

    </form>
  );
}
