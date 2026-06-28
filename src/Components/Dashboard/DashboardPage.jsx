import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./dashboardNew.css";

import OverviewView from "./views/OverviewView";
import ProjectsView from "./views/ProjectsView";
import HackathonsView from "./views/HackathonsView";
import SkillsView from "./views/SkillsView";
import CertificatesView from "./views/CertificatesView";
import PortfolioView from "./views/PortfolioView";
import ResumeView from "./views/ResumeView";
import ProfileView from "./views/ProfileView";

const ico = (d) => <svg className="dn-nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;

const NAV = [
  { group: "dashboard", label: "Dashboard", icon: ico(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>), children: [] },
  { group: "projects", label: "Projects", icon: ico(<><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>), children: [
    { key: "my", label: "My Projects" }, { key: "create", label: "Create Project" }, { key: "templates", label: "Project Templates" },
  ] },
  { group: "hackathons", label: "Hackathons", icon: ico(<><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></>), children: [
    { key: "discover", label: "Discover" }, { key: "participations", label: "My Participations" }, { key: "certificates", label: "Certificates" },
  ] },
  { group: "skills", label: "Skills", icon: ico(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>), children: [
    { key: "my", label: "My Skills" }, { key: "progress", label: "Skill Progress" },
  ] },
  { group: "certificates", label: "Certificates", icon: ico(<><circle cx="12" cy="8" r="6"/><path d="M15.5 12.5 17 22l-5-3-5 3 1.5-9.5"/></>), children: [
    { key: "upload", label: "Upload Certificate" }, { key: "verified", label: "Verified Certificates" },
  ] },
  { group: "portfolio", label: "Portfolio", icon: ico(<><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></>), children: [
    { key: "page", label: "Portfolio Page" }, { key: "share", label: "Share Portfolio" },
  ] },
  { group: "resume", label: "Resume", icon: ico(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>), children: [
    { key: "auto", label: "Auto-Generated Resume" }, { key: "download", label: "Download PDF" },
  ] },
  { group: "profile", label: "Profile", icon: ico(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>), children: [
    { key: "personal", label: "Personal Info" }, { key: "education", label: "Education" }, { key: "settings", label: "Settings" },
  ] },
];

export default function DashboardPage() {
  const { currentUser, userData } = useAuth();
  const [active, setActive] = useState("dashboard");          // "group" or "group/sub"
  const [expanded, setExpanded] = useState("dashboard");      // which group is open
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [group, sub] = active.split("/");
  const userName = userData?.name || currentUser?.displayName || "User";
  const initial = (userName || "?")[0]?.toUpperCase();

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navigate = (key) => {
    setActive(key);
    setExpanded(key.split("/")[0]);
    setDrawerOpen(false);
  };

  const handleParent = (item) => {
    if (item.children.length === 0) { navigate(item.group); return; }
    const isOpen = expanded === item.group;
    setExpanded(isOpen ? "" : item.group);
    if (!isOpen) navigate(`${item.group}/${item.children[0].key}`);
  };

  const renderView = () => {
    const p = { currentUser, userData, sub };
    switch (group) {
      case "dashboard":    return <OverviewView currentUser={currentUser} userData={userData} onNavigate={navigate} />;
      case "projects":     return <ProjectsView {...p} />;
      case "hackathons":   return <HackathonsView {...p} />;
      case "skills":       return <SkillsView {...p} />;
      case "certificates": return <CertificatesView {...p} />;
      case "portfolio":    return <PortfolioView {...p} />;
      case "resume":       return <ResumeView {...p} />;
      case "profile":      return <ProfileView {...p} />;
      default:             return <OverviewView currentUser={currentUser} userData={userData} onNavigate={navigate} />;
    }
  };

  return (
    <div className="dn-root">
      <div className={`dn-overlay ${drawerOpen ? "dn-overlay-show" : ""}`} onClick={() => setDrawerOpen(false)} />

      <aside className={`dn-sidebar ${drawerOpen ? "dn-sidebar-open" : ""}`}>
        <div className="dn-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B43E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          <span className="dn-logo-text">RiseIQ</span>
        </div>

        <button className="dn-new-btn" onClick={() => navigate("projects/create")}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New project
        </button>

        <nav className="dn-nav">
          {NAV.map((item) => {
            const isOpen = expanded === item.group;
            const isActiveParent = group === item.group;
            return (
              <div key={item.group}>
                <button
                  className={`dn-nav-parent ${isOpen ? "dn-open" : ""} ${isActiveParent ? "dn-active-parent" : ""}`}
                  onClick={() => handleParent(item)}
                >
                  {item.icon}
                  <span className="dn-nav-label">{item.label}</span>
                  {item.children.length > 0 && (
                    <svg className="dn-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  )}
                </button>
                {item.children.length > 0 && isOpen && (
                  <div className="dn-nav-children">
                    {item.children.map((c) => (
                      <button
                        key={c.key}
                        className={`dn-nav-child ${active === `${item.group}/${c.key}` ? "dn-active" : ""}`}
                        onClick={() => navigate(`${item.group}/${c.key}`)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="dn-main">
        <header className="dn-topbar">
          <button className="dn-menu-btn" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="dn-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Search projects, hackathons, skills…" />
          </div>
          <div className="dn-topbar-spacer" />
          <div style={{ position: "relative" }} ref={menuRef}>
            <button className="dn-avatar-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="dn-avatar">{initial}</div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {menuOpen && (
              <div className="dn-usermenu">
                <div className="dn-usermenu-head">
                  <p className="dn-usermenu-name">{userName}</p>
                  <p className="dn-usermenu-mail">{currentUser?.email}</p>
                </div>
                <button className="dn-usermenu-item" onClick={() => { setMenuOpen(false); navigate("profile/settings"); }} style={{ color: "var(--dn-ink)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Settings
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="dn-content">{renderView()}</div>
      </div>
    </div>
  );
}
