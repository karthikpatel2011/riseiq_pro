import { Routes, Route, Navigate } from "react-router-dom";
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
import DashboardPage from "./Components/Dashboard/DashboardPage";
import OnboardingPage from "./Components/Onboarding/OnboardingPage";

import { useAuth } from "./contexts/AuthContext";

function FullScreenLoader() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      background: "radial-gradient(circle at center, #1E1B4B, #0F0C20)",
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: "#fff",
      overflow: "hidden"
    }}>
      <div style={{
        position: "relative",
        width: "80px",
        height: "80px",
        marginBottom: "24px",
      }}>
        {/* Outer glowing ring */}
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: "4px solid transparent",
          borderTopColor: "#5B43E6",
          borderBottomColor: "#818CF8",
          animation: "loader-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite"
        }} />
        {/* Inner ring spinning opposite */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "3px solid transparent",
          borderLeftColor: "#22C55E",
          borderRightColor: "#F97316",
          animation: "loader-spin-reverse 1s linear infinite"
        }} />
      </div>
      <style>{`
        @keyframes loader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loader-spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <h2 style={{
        fontSize: "1.25rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        margin: "0 0 8px 0",
        background: "linear-gradient(135deg, #fff, #C7D2FE)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        RiseIQ
      </h2>
      <p style={{
        fontSize: "0.85rem",
        color: "rgba(255, 255, 255, 0.5)",
        margin: 0,
        fontWeight: 400
      }}>
        Loading your campus experience...
      </p>
    </div>
  );
}

function RouteGuard({ element, requireAuth = true, requireOnboarding = true }) {
  const { currentUser, authLoading, onboardingComplete } = useAuth();

  if (authLoading) return <FullScreenLoader />;

  if (requireAuth) {
    if (!currentUser) {
      return <Navigate to="/" replace />;
    }
    if (requireOnboarding && !onboardingComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    if (!requireOnboarding && onboardingComplete) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return element;
}

function Landing() {
  const { currentUser, authLoading, onboardingComplete } = useAuth();

  if (authLoading) return <FullScreenLoader />;

  if (currentUser) {
    if (onboardingComplete) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return (
    <>
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

function App() {
  return (
    <Routes>
      <Route path="/"      element={<Landing />} />
      <Route path="/about"      element={<AboutPage />} />
      <Route
        path="/dashboard"
        element={<RouteGuard element={<DashboardPage />} requireAuth={true} requireOnboarding={true} />}
      />
      <Route
        path="/onboarding"
        element={<RouteGuard element={<OnboardingPage />} requireAuth={true} requireOnboarding={false} />}
      />
      <Route path="*"      element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
