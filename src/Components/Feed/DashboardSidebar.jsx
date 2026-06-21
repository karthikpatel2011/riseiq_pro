import { useNavigate } from "react-router-dom";

const NAV = [
  { key: "home",         label: "Home",                icon: "M3 11l9-8 9 8M5 10v10h14V10" },
  { key: "doubts",       label: "Doubts",              icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { key: "projects",     label: "Projects / Team-Up",  icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { key: "placements",   label: "Placement Intel",     icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { key: "profile",      label: "Profile",             icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { key: "notifications",label: "Notifications",       icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" },
  { key: "bookmarks",    label: "Bookmarks",           icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
  { key: "badges",       label: "Badges",              icon: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12" },
  { key: "settings",     label: "Settings",            icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" },
];

function NavIcon({ d }) {
  return (
    <svg className="dash-nav-icon" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function DashboardSidebar({ active = "home", onNavigate, profile, completion = 80 }) {
  const navigate = useNavigate();

  const name    = profile?.name    || "Your Name";
  const branch  = profile?.branch  || "—";
  const year    = profile?.year    || "";
  const photo   = profile?.photoURL || "";
  const initial = name?.[0]?.toUpperCase() || "?";

  return (
    <aside className="dash-left">
      <div className="dash-logo" onClick={() => navigate("/feed")}>
        <span className="dash-brand-mark" aria-hidden="true">
          <span className="dash-brand-orbit dash-brand-orbit--one" />
          <span className="dash-brand-orbit dash-brand-orbit--two" />
        </span>
        <span className="dash-brand-name">Rise<span>IQ</span></span>
      </div>

      <nav className="dash-nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={`dash-nav-item${active === n.key ? " dash-nav-item--active" : ""}`}
            onClick={() => onNavigate?.(n.key)}
          >
            <NavIcon d={n.icon} />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      <div className="dash-left-foot">
        {/* Profile card */}
        <div className="dash-profile-card">
          {photo ? (
            <img src={photo} alt={name} className="dash-profile-img" />
          ) : (
            <div className="dash-profile-img dash-profile-img--init">{initial}</div>
          )}
          <div className="dash-profile-info">
            <p className="dash-profile-name">{name}</p>
            <p className="dash-profile-meta">{branch}{year ? ` · ${year}` : ""}</p>
            <button className="dash-profile-link" onClick={() => onNavigate?.("profile")}>
              View Profile →
            </button>
          </div>
        </div>

        {/* Progress card */}
        <div className="dash-progress-card">
          <p className="dash-progress-title">Complete your profile</p>
          <p className="dash-progress-sub">Add skills and portfolio to get better matches.</p>
          <div className="dash-progress-bar">
            <div className="dash-progress-fill" style={{ width: `${completion}%` }} />
          </div>
          <div className="dash-progress-row">
            <span className="dash-progress-pct">{completion}%</span>
          </div>
          <button className="dash-progress-btn" onClick={() => navigate("/onboarding")}>
            Edit Profile
          </button>
        </div>
      </div>
    </aside>
  );
}
