import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { Spinner } from "../ui/Spinner";

/**
 * AddCertificateModal — upload a certificate (image/PDF) to Cloudinary and
 * store its metadata under users/{uid}/certificates.
 */
export default function AddCertificateModal({ open, onClose, userId, defaultType = "course" }) {
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [type, setType] = useState(defaultType);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTitle(""); setIssuer(""); setType(defaultType); setFile(null);
    setProgress(0); setLoading(false); setError("");
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = prev; };
  }, [open, defaultType, onClose]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Certificate name is required."); return; }
    if (!file) { setError("Choose a file to upload."); return; }
    setLoading(true);
    try {
      const isImage = file.type.startsWith("image/");
      const url = await uploadToCloudinary(file, `riseiq/users/${userId}/certificates`, isImage ? "image" : "raw", setProgress);
      await addDoc(collection(db, "users", userId, "certificates"), {
        title: title.trim(),
        issuer: issuer.trim(),
        type,
        url,
        verified: false,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.error("AddCertificateModal:", err);
      setError(err.message || "Upload failed. Try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="dn-modal-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="dn-modal" role="dialog" aria-modal="true">
        <div className="dn-modal-head">
          <h2 className="dn-modal-title">Upload certificate</h2>
          <button className="dn-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="dn-modal-body">
            <div className="dn-field">
              <label className="dn-field-label">Certificate name</label>
              <input className="dn-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AWS Cloud Practitioner" disabled={loading} autoFocus />
            </div>
            <div className="dn-field-row">
              <div className="dn-field">
                <label className="dn-field-label">Issuer</label>
                <input className="dn-input" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Amazon, NPTEL…" disabled={loading} />
              </div>
              <div className="dn-field">
                <label className="dn-field-label">Type</label>
                <select className="dn-select" value={type} onChange={(e) => setType(e.target.value)} disabled={loading}>
                  <option value="course">Course</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="internship">Internship</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="dn-field">
              <label className="dn-field-label">File (image or PDF, max 5 MB)</label>
              <input className="dn-input" type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={loading} style={{ padding: "8px" }} />
            </div>
            {loading && progress > 0 && (
              <div className="dn-bar" style={{ marginTop: 4 }}><div className="dn-bar-fill" style={{ width: `${progress}%` }} /></div>
            )}
            {error && <p className="dn-field-err">{error}</p>}
          </div>
          <div className="dn-modal-actions">
            <button type="button" className="dn-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="dn-btn dn-btn-primary" disabled={loading}>
              {loading ? <><Spinner size={15} /> Uploading…</> : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
