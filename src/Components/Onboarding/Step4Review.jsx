import { useState } from "react";

function ReviewRow({ label, value, onEdit }) {
  if (!value && value !== 0) return null;
  return (
    <div className="ob-review-row">
      <span className="ob-review-label">{label}</span>
      <span className="ob-review-value">{value}</span>
      {onEdit && (
        <button type="button" className="ob-review-edit" onClick={onEdit} aria-label={`Edit ${label}`}>
          Edit
        </button>
      )}
    </div>
  );
}

function ReviewSection({ title, stepNum, onJumpTo, children }) {
  return (
    <div className="ob-review-section">
      <div className="ob-review-section-head">
        <span className="ob-review-section-title">{title}</span>
        <button type="button" className="ob-review-edit ob-review-edit--section" onClick={() => onJumpTo(stepNum)}>
          Edit step
        </button>
      </div>
      {children}
    </div>
  );
}

export default function Step4Review({ formData, onBack, onComplete, onJumpTo }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const { step1, step2, step3 } = formData;

  const handleComplete = async () => {
    setError(""); setLoading(true);
    try {
      await onComplete();
    } catch {
      setError("Something went wrong saving your profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="ob-form">

      <p className="ob-review-intro">
        Everything look right? You can jump back to any step to make changes.
      </p>

      <ReviewSection title="Basic Info" stepNum={1} onJumpTo={onJumpTo}>
        <ReviewRow label="Name"    value={step1.name}    />
        <ReviewRow label="College" value={step1.college} />
        <ReviewRow label="Branch"  value={step1.branch}  />
        <ReviewRow label="Year"    value={step1.year}    />
        <ReviewRow label="Gender"  value={step1.gender ? step1.gender[0].toUpperCase() + step1.gender.slice(1) : ""} />
        {step1.phone && <ReviewRow label="Phone" value={step1.phone} />}
      </ReviewSection>

      <ReviewSection title="Skills & Interests" stepNum={2} onJumpTo={onJumpTo}>
        <ReviewRow
          label="Skills"
          value={step2.skills.length ? step2.skills.join(", ") : "—"}
        />
        <ReviewRow
          label="Interests"
          value={step2.interests.length ? step2.interests.join(", ") : "—"}
        />
      </ReviewSection>

      <ReviewSection title="Your Work" stepNum={3} onJumpTo={onJumpTo}>
        <ReviewRow label="Resume"  value={step3.resumeURL  ? "PDF uploaded ✓" : "—"} />
        <ReviewRow label="Photo"   value={step3.photoURL   ? "Photo uploaded ✓" : "—"} />
        {step3.project?.title && (
          <ReviewRow label="Project" value={step3.project.title} />
        )}
      </ReviewSection>

      {error && <div className="am-error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <div className="ob-review-cta">
        <p className="ob-review-cta-note">
          Your profile is saved as a draft automatically. Completing it enables co-founder matching and placement intel.
        </p>
        <div className="ob-actions ob-actions--two">
          <button type="button" className="ob-btn-ghost" onClick={onBack} disabled={loading}>
            ← Back
          </button>
          <button type="button" className="ob-btn-complete" onClick={handleComplete} disabled={loading}>
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" style={{ animation: "am-spin 0.7s linear infinite", marginRight: "6px", verticalAlign: "middle" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Launching…
              </>
            ) : (
              "Complete Profile — Launch →"
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
