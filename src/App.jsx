import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Secondpage from "./Components/Secondpage";
import Thirdpage from "./Components/Thirdpage";
import Fourthpage from "./Components/Fourthpage";
import Fifthpage from "./Components/Fifthpage";
import Sixthpage from "./Components/Sixthpage";
import Seventh from "./Components/Seventh";
import Eightcard from "./Components/Eightcard";
import Footer1 from "./Components/Footer1";
import AboutPage from "./Components/AboutPage";
import OnboardingPage from "./Components/Onboarding/OnboardingPage";
import FeedPage from "./Components/Feed/FeedPage";
import { useAuth } from "./contexts/AuthContext";

/* ── Cookie consent banner ── */
function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem("cookie_consent"));
  if (!visible) return null;
  const accept  = () => { localStorage.setItem("cookie_consent", "accepted");  setVisible(false); };
  const decline = () => { localStorage.setItem("cookie_consent", "declined");  setVisible(false); };
  return (
    <div className="ck-banner">
      <div className="ck-inner">
        <div className="ck-text">
          <p className="ck-title">We use cookies</p>
          <p className="ck-sub">
            RiseIQ uses cookies to remember your preferences.
            No third-party tracking. <a className="ck-link" href="/about">Learn more</a>
          </p>
        </div>
        <div className="ck-btns">
          <button className="ck-btn-decline" onClick={decline}>Decline</button>
          <button className="ck-btn-accept" onClick={accept}>Accept &amp; Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ── Landing page ── */
function Landing() {
  return (
    <>
      <CookieBanner />
      <Navbar />
      <Home />
      <Secondpage />
      <Thirdpage />
      <Fourthpage />
      <Fifthpage />
      <Sixthpage />
      <Eightcard />
      <Seventh />
      <Footer1 />
    </>
  );
}

/* ── Auth + onboarding guard ── */
function OnboardingGate({ children }) {
  const { currentUser, authLoading, onboardingComplete } = useAuth();
  const location = useLocation();

  // Wait for Firebase Auth (+ the one-time Firestore profile read) to resolve
  if (authLoading) return null;

  // Logged in but hasn't completed onboarding — send to onboarding
  if (currentUser && !onboardingComplete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Logged in + onboarding done + on the landing/about page — send to feed
  if (currentUser && onboardingComplete && (location.pathname === "/" || location.pathname === "/about")) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}

/* ── FeedGuard: /feed only for logged-in users who finished onboarding ── */
function FeedGuard() {
  const { currentUser, authLoading, onboardingComplete } = useAuth();
  if (authLoading) return null;
  if (!currentUser)          return <Navigate to="/"           replace />;
  if (!onboardingComplete)   return <Navigate to="/onboarding" replace />;
  return <FeedPage />;
}

function App() {
  return (
    <OnboardingGate>
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/about"      element={<AboutPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/feed"       element={<FeedGuard />} />
        {/* Placeholder detail routes — cards navigate here, detail pages built next */}
        <Route path="/doubts/:id"          element={<FeedGuard />} />
        <Route path="/projects/:id"        element={<FeedGuard />} />
        <Route path="/placements/:id"      element={<FeedGuard />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </OnboardingGate>
  );
}

export default App;
