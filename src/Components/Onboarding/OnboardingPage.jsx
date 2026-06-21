import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";

import ProgressBar from "./ProgressBar";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Skills from "./Step2Skills";
import Step3Resume from "./Step3Resume";
import Step4Review from "./Step4Review";
import logo from "../../assets/logo.png";

const STEP_META = [
  { num: 1, label: "Basic Info",    sub: "Who are you?"          },
  { num: 2, label: "Skills",        sub: "What do you know?"     },
  { num: 3, label: "Your Work",     sub: "Show your proof"       },
  { num: 4, label: "Review",        sub: "Confirm & launch"      },
];

const EMPTY_FORM = {
  step1: { name: "", college: "", branch: "", year: "", gender: "", phone: "" },
  step2: { skills: [], interests: [] },
  step3: { photoURL: "", resumeURL: "", project: { title: "", description: "", link: "" } },
};

export default function OnboardingPage() {
  const { currentUser, setOnboardingComplete } = useAuth();
  const navigate        = useNavigate();

  const [step,       setStep]      = useState(1);
  const [direction,  setDirection] = useState("forward");
  const [formData,   setFormData]  = useState(EMPTY_FORM);
  const [loading,    setLoading]   = useState(true); // initial Firestore load
  const [animKey,    setAnimKey]   = useState(0);    // force re-mount for transition

  /* ── Load draft / check onboarding complete on mount ── */
  useEffect(() => {
    if (!currentUser) { navigate("/", { replace: true }); return; }

    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.onboardingComplete) { navigate("/feed", { replace: true }); return; }
          if (data.onboardingDraft) {
            const { step: savedStep, ...savedData } = data.onboardingDraft;
            setFormData(prev => ({ ...prev, ...savedData }));
            if (savedStep) setStep(savedStep);
          }
        }
        // Pre-fill name from Firebase Auth if not in draft
        setFormData(prev => ({
          ...prev,
          step1: {
            ...prev.step1,
            name: prev.step1.name || currentUser.displayName || "",
          },
        }));
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser, navigate]);

  /* ── Save draft to Firestore ── */
  const saveDraft = useCallback(async (nextStep, updatedForm) => {
    if (!currentUser) return;
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          email: currentUser.email,
          onboardingDraft: { step: nextStep, ...updatedForm },
        },
        { merge: true }
      );
    } catch {
      // non-fatal — user can still continue
    }
  }, [currentUser]);

  /* ── Step navigation ── */
  const handleNext = useCallback(async (stepKey, stepData) => {
    const updatedForm = { ...formData, [stepKey]: stepData };
    setFormData(updatedForm);
    const nextStep = step + 1;
    setDirection("forward");
    setAnimKey(k => k + 1);
    setStep(nextStep);
    await saveDraft(nextStep, updatedForm);
  }, [formData, step, saveDraft]);

  const handleBack = useCallback(() => {
    setDirection("back");
    setAnimKey(k => k + 1);
    setStep(s => s - 1);
  }, []);

  /* ── Complete onboarding → write full user doc ── */
  const handleComplete = useCallback(async () => {
    if (!currentUser) return;
    const d = formData;
    const userDoc = {
      name:               d.step1.name,
      email:              currentUser.email,
      phone:              d.step1.phone   || "",
      college:            d.step1.college,
      branch:             d.step1.branch,
      year:               d.step1.year,
      gender:             d.step1.gender,
      skills:             d.step2.skills,
      interests:          d.step2.interests,
      photoURL:           d.step3.photoURL  || currentUser.photoURL || "",
      resumeURL:          d.step3.resumeURL || "",
      onboardingComplete: true,
      onboardingDraft:    null,
      createdAt:          serverTimestamp(),
    };
    await setDoc(doc(db, "users", currentUser.uid), userDoc, { merge: true });

    // Save optional first portfolio item
    const p = d.step3.project;
    if (p.title) {
      await addDoc(collection(db, "users", currentUser.uid, "portfolio"), {
        title:       p.title,
        description: p.description,
        link:        p.link,
        addedAt:     serverTimestamp(),
      });
    }

    // Update context immediately so OnboardingGate doesn't redirect back
    setOnboardingComplete(true);
    navigate("/feed", { replace: true });
  }, [currentUser, formData, navigate]);

  if (loading) {
    return (
      <div className="ob-page">
        <div className="ob-loading">
          <div className="ob-loading-spinner" />
          <p>Loading your profile…</p>
        </div>
      </div>
    );
  }

  const currentMeta = STEP_META[step - 1];
  const animClass   = direction === "forward" ? "ob-step--enter-right" : "ob-step--enter-left";

  return (
    <div className="ob-page">
      <div className="ob-shell">

        {/* ── Left sidebar ── */}
        <aside className="ob-sidebar">
          <img src={logo} alt="RiseIQ" className="ob-logo" onClick={() => navigate("/")} />
          <div className="ob-sidebar-body">
            <ProgressBar currentStep={step} steps={STEP_META} />
          </div>
          <p className="ob-sidebar-foot">Your profile stays private until you're ready.</p>
        </aside>

        {/* ── Right content area ── */}
        <main className="ob-content">
          <div className="ob-step-header">
            <span className="ob-step-badge">Step {step} of {STEP_META.length}</span>
            <h1 className="ob-step-title">{currentMeta.label}</h1>
            <p className="ob-step-sub">{currentMeta.sub}</p>
          </div>

          <div className={`ob-step-wrap ob-step--anim ${animClass}`} key={animKey}>
            {step === 1 && (
              <Step1BasicInfo
                data={formData.step1}
                onNext={(d) => handleNext("step1", d)}
              />
            )}
            {step === 2 && (
              <Step2Skills
                data={formData.step2}
                onNext={(d) => handleNext("step2", d)}
                onBack={handleBack}
              />
            )}
            {step === 3 && (
              <Step3Resume
                data={formData.step3}
                userId={currentUser.uid}
                onNext={(d) => handleNext("step3", d)}
                onBack={handleBack}
              />
            )}
            {step === 4 && (
              <Step4Review
                formData={formData}
                onBack={handleBack}
                onComplete={handleComplete}
                onJumpTo={(s) => { setDirection("back"); setAnimKey(k => k + 1); setStep(s); }}
              />
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
