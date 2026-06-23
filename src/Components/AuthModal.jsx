import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import logo from "../assets/logo.png";

/* ─────────── small icons ─────────── */
function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "am-spin 0.7s linear infinite", display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

/* map firebase error codes → friendly messages */
function friendlyError(code) {
  const map = {
    "auth/user-not-found":        "No account found with this email.",
    "auth/wrong-password":        "Incorrect password. Try again.",
    "auth/invalid-credential":    "Incorrect email or password.",
    "auth/email-already-in-use":  "An account with this email already exists.",
    "auth/invalid-email":         "Please enter a valid email address.",
    "auth/weak-password":         "Password must be at least 6 characters.",
    "auth/too-many-requests":     "Too many attempts. Please wait a moment.",
    "auth/popup-closed-by-user":  "Sign-in popup was closed. Please try again.",
    "auth/network-request-failed":"Network error. Check your connection.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

/* ─────────── main component ─────────── */
function AuthModalInner({ initialTab = "login", onClose }) {
  const [tab, setTab]         = useState(initialTab);
  const [showPw, setShowPw]   = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const overlayRef            = useRef(null);
  const navigate              = useNavigate();

  /* login fields */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw]       = useState("");
  const [loginErr, setLoginErr]     = useState("");

  /* signup fields */
  const [signupName,    setSignupName]    = useState("");
  const [signupEmail,   setSignupEmail]   = useState("");
  const [signupCollege, setSignupCollege] = useState("");
  const [signupPw,      setSignupPw]      = useState("");
  const [signupPw2,     setSignupPw2]     = useState("");
  const [signupErr,     setSignupErr]     = useState("");

  /* close handlers */
  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) onClose(); };
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  /* lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* shared: close modal and send to onboarding */
  const afterAuth = async () => {
    onClose();
    navigate("/onboarding");
  };

  /* ── LOGIN ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPw) { setLoginErr("Please fill in all fields."); return; }
    setLoginErr(""); setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPw);
      await afterAuth(cred.user);
    } catch (err) {
      setLoginErr(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  /* ── SIGN UP ── */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPw) { setSignupErr("Please fill in all required fields."); return; }
    if (signupPw !== signupPw2) { setSignupErr("Passwords do not match."); return; }
    setSignupErr(""); setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, signupEmail, signupPw);
      await updateProfile(cred.user, { displayName: signupName });
      onClose();
      navigate("/onboarding");
    } catch (err) {
      setSignupErr(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  /* ── GOOGLE ── */
  const handleGoogle = async () => {
    setLoginErr(""); setSignupErr(""); setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await afterAuth(cred.user);
    } catch (err) {
      const msg = friendlyError(err.code);
      tab === "login" ? setLoginErr(msg) : setSignupErr(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── FORGOT PASSWORD ── */
  const handleForgot = async () => {
    if (!loginEmail) { setLoginErr("Enter your email above first."); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      setSuccess("Reset email sent! Check your inbox.");
    } catch (err) {
      setLoginErr(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setLoginErr(""); setSignupErr(""); setSuccess(""); };

  return (
    <div className="am-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="am-card">

        {/* close × */}
        <button className="am-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13"/>
            <line x1="13" y1="1" x2="1" y2="13"/>
          </svg>
        </button>

        <img className="am-logo" src={logo} alt="RiseIQ" />
        <p className="am-welcome">{tab === "login" ? "Welcome back" : "Join RiseIQ"}</p>
        <p className="am-sub">
          {tab === "login"
            ? "Sign in to your campus career OS"
            : "Build your verified skill profile — free forever"}
        </p>

        {/* tabs */}
        <div className="am-tabs">
          <button className={`am-tab ${tab === "login"  ? "am-tab--active" : ""}`} onClick={() => switchTab("login")}>Login</button>
          <button className={`am-tab ${tab === "signup" ? "am-tab--active" : ""}`} onClick={() => switchTab("signup")}>Sign Up</button>
        </div>

        {/* success banner */}
        {success && <div className="am-success">{success}</div>}

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <form className="am-form" onSubmit={handleLogin}>
            {loginErr && <div className="am-error">{loginErr}</div>}

            <div className="am-field">
              <label className="am-label">EMAIL</label>
              <div className="am-input-wrap">
                <input className="am-input" type="email" placeholder="you@university.edu"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  autoComplete="email" disabled={loading} />
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">PASSWORD</label>
              <div className="am-input-wrap">
                <input className="am-input am-input--has-eye"
                  type={showPw ? "text" : "password"} placeholder="••••••••"
                  value={loginPw} onChange={e => setLoginPw(e.target.value)}
                  autoComplete="current-password" disabled={loading} />
                <button type="button" className="am-eye" onClick={() => setShowPw(p => !p)}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <button type="button" className="am-forgot" onClick={handleForgot} disabled={loading}>
              Forgot password?
            </button>

            <button className="am-submit" type="submit" disabled={loading}>
              {loading ? <><Spinner />Signing in…</> : "Sign In"}
            </button>

            <div className="am-divider">
              <span className="am-divider-line" />
              <span className="am-divider-text">or</span>
              <span className="am-divider-line" />
            </div>

            <button type="button" className="am-google" onClick={handleGoogle} disabled={loading}>
              <GoogleIcon /> Continue with Google
            </button>

            <p className="am-switch">
              New here? <span onClick={() => switchTab("signup")}>Create an account</span>
            </p>
          </form>
        )}

        {/* ── SIGNUP FORM ── */}
        {tab === "signup" && (
          <form className="am-form" onSubmit={handleSignup}>
            {signupErr && <div className="am-error">{signupErr}</div>}

            <div className="am-field">
              <label className="am-label">FULL NAME</label>
              <div className="am-input-wrap">
                <input className="am-input" type="text" placeholder="Your name"
                  value={signupName} onChange={e => setSignupName(e.target.value)}
                  autoComplete="name" disabled={loading} />
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">EMAIL</label>
              <div className="am-input-wrap">
                <input className="am-input" type="email" placeholder="you@university.edu"
                  value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                  autoComplete="email" disabled={loading} />
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">
                COLLEGE / UNIVERSITY <span style={{ opacity: 0.5 }}>(optional)</span>
              </label>
              <div className="am-input-wrap">
                <input className="am-input" type="text" placeholder="e.g. IIT Bombay, VIT, BITS…"
                  value={signupCollege} onChange={e => setSignupCollege(e.target.value)}
                  disabled={loading} />
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">PASSWORD</label>
              <div className="am-input-wrap">
                <input className="am-input am-input--has-eye"
                  type={showPw ? "text" : "password"} placeholder="Min. 6 characters"
                  value={signupPw} onChange={e => setSignupPw(e.target.value)}
                  autoComplete="new-password" disabled={loading} />
                <button type="button" className="am-eye" onClick={() => setShowPw(p => !p)}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">CONFIRM PASSWORD</label>
              <div className="am-input-wrap">
                <input className="am-input am-input--has-eye"
                  type={showPw2 ? "text" : "password"} placeholder="Repeat password"
                  value={signupPw2} onChange={e => setSignupPw2(e.target.value)}
                  autoComplete="new-password" disabled={loading} />
                <button type="button" className="am-eye" onClick={() => setShowPw2(p => !p)}>
                  <EyeIcon open={showPw2} />
                </button>
              </div>
            </div>

            <button className="am-submit" type="submit" disabled={loading}>
              {loading ? <><Spinner />Creating account…</> : "Create Account — It's Free"}
            </button>

            <div className="am-divider">
              <span className="am-divider-line" />
              <span className="am-divider-text">or</span>
              <span className="am-divider-line" />
            </div>

            <button type="button" className="am-google" onClick={handleGoogle} disabled={loading}>
              <GoogleIcon /> Sign up with Google
            </button>

            <p className="am-switch">
              Already have an account? <span onClick={() => switchTab("login")}>Sign in</span>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}

/* render through a portal so it always sits above ALL page content */
function AuthModal(props) {
  return createPortal(<AuthModalInner {...props} />, document.body);
}

export default AuthModal;
