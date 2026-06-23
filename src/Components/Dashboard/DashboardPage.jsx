import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import "./dashboard.css";

import HomeView from "./views/HomeView";
import DoubtsView from "./views/DoubtsView";
import ProjectsView from "./views/ProjectsView";
import PlacementsView from "./views/PlacementsView";
import BookmarksView from "./views/BookmarksView";
import ProfileView from "./views/ProfileView";

const NAV_ITEMS = [
  { key: "home",        label: "Home",            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M3 12v9h18V12"/></svg> },
  { key: "doubts",      label: "Ask a Doubt",     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { key: "teammates",   label: "Find Teammates",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { key: "projects",    label: "Projects / Teams",icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { key: "placements",  label: "Placements",      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
  { key: "bookmarks",   label: "Bookmarks",       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> },
  { key: "profile",     label: "Profile",         icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg> },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [active, setActive] = useState("home");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const menuRef = useRef(null);

  const userName = userData?.name || currentUser?.displayName || "User";
  const initial = (userName || "?")[0]?.toUpperCase();

  useEffect(() => {
    function clickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  // Map nav keys to views
  const renderView = () => {
    const props = { currentUser, userData };
    switch (active) {
      case "home":        return <HomeView {...props} />;
      case "doubts":      return <DoubtsView {...props} />;
      case "teammates":
      case "projects":    return <ProjectsView {...props} />;
      case "placements":  return <PlacementsView {...props} />;
      case "bookmarks":   return <BookmarksView {...props} currentUser={currentUser} />;
      case "profile":     return <ProfileView {...props} />;
      default:            return <HomeView {...props} />;
    }
  };

  return (
    <div className="db-root">

      {/* ── LEFT SIDEBAR ── */}
      <aside className={`db-sidebar ${sidebarCollapsed ? "db-sidebar--collapsed" : ""}`}>
        <div className="db-logo" style={{ justifyContent: sidebarCollapsed ? "center" : "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <svg className="db-logo-icon" viewBox="0 0 24 24" fill="none" stroke="#5B43E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            {!sidebarCollapsed && <span className="db-logo-text">RiseIQ</span>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="db-sidebar-toggle"
            aria-label="Toggle sidebar"
            style={{
              background: "none", border: "none", color: "#64748B", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "5px", borderRadius: "6px", transition: "background .15s",
              marginLeft: sidebarCollapsed ? "0" : "8px",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#F1F5F9"}
            onMouseOut={(e) => e.currentTarget.style.background = "none"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
            </svg>
          </button>
        </div>

        <nav className="db-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`db-nav-item${active === item.key ? " db-nav-item--active" : ""}`}
              onClick={() => setActive(item.key)}
              title={sidebarCollapsed ? item.label : ""}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="db-main">

        {/* Top Bar */}
        <header className="db-topbar">
          <div className="db-search-wrap">
            <svg className="db-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className="db-search-input" placeholder="Search doubts, projects, people, skills..." />
            <kbd className="db-search-kbd">⌘K</kbd>
          </div>
          <div className="db-topbar-actions">

            <div style={{ position: "relative" }} ref={menuRef}>
              <button className="db-avatar-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="db-avatar">{initial}</div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M6 9l6 6 6-6"/></svg>
              </button>

              {showUserMenu && (
                <div style={{
                  position: "absolute", right: 0, top: "100%", marginTop: "8px",
                  background: "#fff", border: "1px solid #E8EDF2", borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  padding: "6px", zIndex: 100, minWidth: "180px",
                }}>
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid #F1F5F9", marginBottom: "4px" }}>
                    <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: "#1E293B" }}>{userName}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748B", wordBreak: "break-all" }}>{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", width: "100%",
                      padding: "8px 12px", background: "none", border: "none", borderRadius: "8px",
                      fontSize: "12px", fontWeight: 600, color: "#EF4444", cursor: "pointer", textAlign: "left",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#FEF2F2"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content — renders the active view */}
        <div className="db-content">
          {renderView()}
        </div>

      </div>
    </div>
  );
}
