import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function DashboardTopNav({ user, search, setSearch, onToggleSidebar, onCreate }) {
  const navigate  = useNavigate();
  const searchRef = useRef(null);

  // Ctrl/Cmd+K to focus search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const initial = user?.displayName?.[0]?.toUpperCase()
               || user?.email?.[0]?.toUpperCase()
               || "?";

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <header className="dash-topnav">
      <button className="dash-hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <div className="dash-search">
        <svg className="dash-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={searchRef}
          className="dash-search-input"
          placeholder="Search doubts, projects, people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="dash-search-kbd">Ctrl + K</span>
      </div>

      <div className="dash-topnav-actions">
        <button className="dash-create-btn" onClick={onCreate} aria-label="Create">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <button className="dash-icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="dash-icon-badge">3</span>
        </button>

        <button className="dash-icon-btn" aria-label="Messages">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        <button className="dash-avatar-btn" onClick={handleSignOut} title="Sign out">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "You"} className="dash-avatar" />
          ) : (
            <div className="dash-avatar dash-avatar--init">{initial}</div>
          )}
        </button>
      </div>
    </header>
  );
}
