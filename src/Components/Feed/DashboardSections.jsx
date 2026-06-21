import femaleStudent from "../../assets/dashboard-student-female.png";
import maleStudent from "../../assets/dashboard-student-male.png";

/* ── Welcome hero ── */
export function WelcomeHero({ name, gender }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const studentImage = String(gender).toLowerCase() === "female" ? femaleStudent : maleStudent;
  return (
    <section className="dash-hero">
      <div className="dash-hero-text">
        <h1 className="dash-hero-greeting">{greeting}, {name || "there"} <span aria-hidden="true">👋</span></h1>
        <p className="dash-hero-sub">Let's keep building, learning and helping others.</p>
      </div>
      <div className="dash-hero-art" aria-hidden="true">
        <div className="dash-hero-blob dash-hero-blob--1" />
        <div className="dash-hero-blob dash-hero-blob--2" />
        <img className="dash-hero-student" src={studentImage} alt="" />
      </div>
    </section>
  );
}

/* ── Stats row ── */
const STAT_ICONS = {
  q:   "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  bag: "M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

function StatCard({ icon, value, label, sub, growth, live, tone }) {
  return (
    <div className={`dash-stat-card dash-stat-card--${tone}`}>
      <div className={`dash-stat-icon dash-stat-icon--${tone}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={STAT_ICONS[icon]} />
        </svg>
      </div>
      <div className="dash-stat-body">
        <span className="dash-stat-value">{value}</span>
        <span className="dash-stat-label">{label}</span>
        <span className="dash-stat-sub">{sub}</span>
      </div>
      {live ? (
        <span className="dash-stat-live"><span className="dash-live-dot" />Live</span>
      ) : (
        <span className="dash-stat-growth">↑ {growth}</span>
      )}
    </div>
  );
}

export function StatsRow() {
  return (
    <section className="dash-stats">
      <StatCard tone="purple" icon="q"     value="47"  label="Doubts Solved"     sub="Today"     growth="23%" />
      <StatCard tone="green"  icon="bag"   value="16"  label="Open Projects"     sub="Available" growth="12%" />
      <StatCard tone="orange" icon="doc"   value="28"  label="Placement Stories" sub="This Week" growth="18%" />
      <StatCard tone="blue"   icon="users" value="132" label="Students Online"   sub="Right Now" live />
    </section>
  );
}

/* ── Quick actions ── */
export function QuickActions({ user, onAsk, onPost, onShare }) {
  const initial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";
  return (
    <section className="dash-quick">
      {user?.photoURL ? (
        <img src={user.photoURL} alt="You" className="dash-quick-avatar" />
      ) : (
        <div className="dash-quick-avatar dash-quick-avatar--init">{initial}</div>
      )}
      <button className="dash-quick-placeholder" onClick={onAsk}>
        What are you working on today?
      </button>
      <div className="dash-quick-actions">
        <button className="dash-quick-btn dash-quick-btn--doubt" onClick={onAsk}>
          <span className="dash-quick-ic">?</span> Ask Doubt
        </button>
        <button className="dash-quick-btn dash-quick-btn--project" onClick={onPost}>
          <span className="dash-quick-ic">▣</span> Post Project
        </button>
        <button className="dash-quick-btn dash-quick-btn--story" onClick={onShare}>
          <span className="dash-quick-ic">◇</span> Share Story
        </button>
      </div>
    </section>
  );
}
