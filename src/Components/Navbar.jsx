import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";

const homeLinks = [
  { label: "About",        href: "/about" },
  { label: "Features",     href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing",      href: "/#pricing" },
  { label: "Testimonials", href: "/#testimonials" },
];

const companyLinks = [
  { label: "About Us",  href: "/about" },
  { label: "Blog",      href: "/blog" },
  { label: "Careers",   href: "/careers" },
  { label: "Press",     href: "/press" },
];

function Dropdown({ label, items, navigate, closeAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        className={`nav-drop-trigger ${open ? "nav-drop-trigger--open" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="nav-drop-menu">
          {items.map((item, i) => (
            <button
              key={i}
              className="nav-drop-item"
              onClick={() => {
                setOpen(false);
                closeAll();
                navigate(item.href);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [visible, setVisible]     = useState(true);
  const [authTab, setAuthTab]     = useState(null); // null | 'login' | 'signup'
  const lastScrollY               = useRef(0);
  const navigate                  = useNavigate();
  const location                  = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, onboardingComplete } = useAuth();

  const closeAll = () => setMenuOpen(false);

  const openLogin  = () => { setMenuOpen(false); setAuthTab("login");  };
  const openSignup = () => { setMenuOpen(false); setAuthTab("signup"); };
  const closeAuth  = () => {
    setAuthTab(null);
    if (searchParams.get("auth")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("auth");
      setSearchParams(newParams);
    }
  };

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "login" || authParam === "signup") {
      setAuthTab(authParam);
    }
  }, [searchParams]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y < 60) { setVisible(true); }
      else if (y > lastScrollY.current + 6) { setVisible(false); setMenuOpen(false); }
      else if (y < lastScrollY.current - 6) { setVisible(true); }
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { closeAll(); }, [location.pathname]);

  return (
    <>
      <nav className={`nav2 ${visible ? "nav2--visible" : "nav2--hidden"} ${menuOpen ? "nav2--open" : ""}`}>
        <div className="nav2-inner">
          <img className="nav2-logo" src={logo} alt="RiseIQ" onClick={() => navigate("/")} />

          <div className={`nav2-links ${menuOpen ? "nav2-links--open" : ""}`}>
            <Dropdown label="Home"    items={homeLinks}    navigate={navigate} closeAll={closeAll} />
            <Dropdown label="Company" items={companyLinks} navigate={navigate} closeAll={closeAll} />
            <button className="nav2-link" onClick={() => { closeAll(); navigate("/#pricing"); }}>Pricing</button>
          </div>

          <div className={`nav2-actions ${menuOpen ? "nav2-actions--open" : ""}`}>
            {currentUser ? (
              <button
                className="nav2-dashboard-btn"
                onClick={() => {
                  closeAll();
                  navigate(onboardingComplete ? "/dashboard" : "/onboarding");
                }}
                style={{
                  background: "linear-gradient(135deg, #5B43E6, #818CF8)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "0 4px 12px rgba(91, 67, 230, 0.2)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(91, 67, 230, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(91, 67, 230, 0.2)";
                }}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button className="nav2-login"  onClick={openLogin}>Login</button>
                <button className="nav2-signup" onClick={openSignup}>Sign Up</button>
              </>
            )}
          </div>

          <button
            className={`nav2-hamburger ${menuOpen ? "nav2-hamburger--open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      {authTab && <AuthModal initialTab={authTab} onClose={closeAuth} />}
    </>
  );
}

export default Navbar;
