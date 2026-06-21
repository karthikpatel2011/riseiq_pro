import React from "react";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );
}

export default function ProgressBar({ currentStep, steps }) {
  return (
    <nav className="ob-progress" aria-label="Onboarding steps">
      {steps.map((s, idx) => {
        const done    = currentStep > s.num;
        const active  = currentStep === s.num;
        const nodeClass = done ? "ob-pnode ob-pnode--done" : active ? "ob-pnode ob-pnode--active" : "ob-pnode";

        return (
          <div className="ob-pitem" key={s.num}>
            {/* connector line above (skip for first) */}
            {idx > 0 && (
              <div className={`ob-pline ${currentStep > idx ? "ob-pline--filled" : ""}`} />
            )}

            <div className="ob-prow">
              <div className={nodeClass}>
                {active  && <div className="ob-pnode-pulse" />}
                {done    ? <CheckIcon /> : <span>{s.num}</span>}
              </div>
              <div className="ob-plabel">
                <span className="ob-plabel-title">{s.label}</span>
                <span className="ob-plabel-sub">{s.sub}</span>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
