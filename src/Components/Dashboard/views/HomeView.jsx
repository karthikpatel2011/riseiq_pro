import { useState, useMemo } from "react";
import { useFeed } from "../../../hooks/useFeed";
import DoubtCard from "../cards/DoubtCard";
import ProjectCard from "../cards/ProjectCard";
import PlacementCard from "../cards/PlacementCard";
import EmptyState from "../ui/EmptyState";
import CreateDoubtModal from "../modals/CreateDoubtModal";
import CreateProjectModal from "../modals/CreateProjectModal";
import CreatePlacementModal from "../modals/CreatePlacementModal";

// 3D Illustration Imports
import heroIllustration from "../../../assets/dashboard-hero.png";
import doubtIllustration from "../../../assets/dashboard-doubt.png";
import teammatesIllustration from "../../../assets/dashboard-teammates.png";
import placementsIllustration from "../../../assets/dashboard-placements.png";
import learnIllustration from "../../../assets/dashboard-learn.png";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeView({ currentUser, userData }) {
  const { items, loading } = useFeed("all");
  const [doubtOpen, setDoubtOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const userName = userData?.name || currentUser?.displayName || "Student";
  const userId = currentUser?.uid;

  // Filter recent activity items based on active tab
  const filteredActivity = useMemo(() => {
    return items.filter((item) => {
      if (activeTab === "all") return true;
      if (activeTab === "doubts") return item.type === "doubt";
      if (activeTab === "projects") return item.type === "project";
      if (activeTab === "placements") return item.type === "placement";
      return true;
    });
  }, [items, activeTab]);

  // Extract first items of each type for the recommended section
  const recommendedItems = useMemo(() => {
    const firstProject = items.find((i) => i.type === "project");
    const firstPlacement = items.find((i) => i.type === "placement");
    const firstDoubt = items.find((i) => i.type === "doubt");
    return { firstProject, firstPlacement, firstDoubt };
  }, [items]);

  if (loading) {
    return (
      <div className="db-view-loading">
        <div className="db-view-spinner" />
        <p>Loading your campus experience…</p>
      </div>
    );
  }

  return (
    <div className="db-home-view">
      
      {/* ── HERO BANNER (CLEAN & BORDERLESS) ── */}
      <section className="db-home-hero">
        <div className="db-hero-text">
          <span className="db-hero-greeting">{getGreeting()}, {userName}! 👋</span>
          <h1 className="db-hero-title">
            What do you want to <span className="db-highlight-text">achieve today?</span>
          </h1>
        </div>
        <div className="db-hero-image-wrap">
          <img src={heroIllustration} alt="Achieve today" className="db-hero-3d" />
        </div>
      </section>

      {/* ── QUICK ACTION CARDS (CENTRED Mockup Style) ── */}
      <section className="db-home-actions-grid">
        
        <div className="db-action-card db-card-indigo" onClick={() => setDoubtOpen(true)}>
          <img src={doubtIllustration} alt="Ask a Doubt" className="db-action-card-illustration" />
          <h3 className="db-action-card-title">Ask a Doubt</h3>
          <p className="db-action-card-desc">Get help from peers and seniors</p>
          <button className="db-action-card-btn" aria-label="Ask a Doubt">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="db-action-card db-card-emerald" onClick={() => setProjectOpen(true)}>
          <img src={teammatesIllustration} alt="Find Teammates" className="db-action-card-illustration" />
          <h3 className="db-action-card-title">Find Teammates</h3>
          <p className="db-action-card-desc">Work on exciting projects together</p>
          <button className="db-action-card-btn" aria-label="Find Teammates">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="db-action-card db-card-orange" onClick={() => setPlacementOpen(true)}>
          <img src={placementsIllustration} alt="Explore Placements" className="db-action-card-illustration" />
          <h3 className="db-action-card-title">Explore Placements</h3>
          <p className="db-action-card-desc">Discover real interview experiences</p>
          <button className="db-action-card-btn" aria-label="Explore Placements">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="db-action-card db-card-blue" onClick={() => setDoubtOpen(true)}>
          <img src={learnIllustration} alt="Share & Learn" className="db-action-card-illustration" />
          <h3 className="db-action-card-title">Share & Learn</h3>
          <p className="db-action-card-desc">Share knowledge and grow together</p>
          <button className="db-action-card-btn" aria-label="Share & Learn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

      </section>

      {/* ── RECOMMENDED FOR YOU ── */}
      <section className="db-home-section">
        <div className="db-section-header">
          <h2 className="db-section-title">Recommended for you</h2>
          <span className="db-view-all-link">View all</span>
        </div>
        
        {items.length === 0 ? (
          <EmptyState
            title="No recommendations yet"
            description="Start exploring by asking doubts, posting projects, or writing placement stories!"
            action={{ label: "Ask a Doubt", onClick: () => setDoubtOpen(true) }}
          />
        ) : (
          <div className="db-recommendations-grid">
            {/* 1. Project Card (Dynamic or Mock Fallback) */}
            {recommendedItems.firstProject ? (
              <ProjectCard item={recommendedItems.firstProject} currentUser={currentUser} />
            ) : (
              <div className="db-card db-mock-card">
                <div className="db-card-head">
                  <span className="db-card-badge db-card-badge--skill">PROJECT</span>
                  <div className="db-card-tags">
                    <span className="db-card-badge">Flutter</span>
                    <span className="db-card-badge">Firebase</span>
                  </div>
                </div>
                <h3 className="db-card-title">Need Flutter Developer for SIH 2026</h3>
                <p className="db-card-body">Looking for a mobile developer to collaborate on Smart India Hackathon project...</p>
                <div className="db-card-foot">
                  <span className="db-card-stat" style={{ color: "#22C55E" }}>2 spots left</span>
                </div>
              </div>
            )}

            {/* 2. Placement Card (Dynamic or Mock Fallback) */}
            {recommendedItems.firstPlacement ? (
              <PlacementCard item={recommendedItems.firstPlacement} currentUser={currentUser} />
            ) : (
              <div className="db-card db-mock-card">
                <div className="db-card-head">
                  <span className="db-card-badge db-card-badge--company">PLACEMENT</span>
                  <div className="db-card-tags">
                    <span className="db-card-badge">Microsoft</span>
                    <span className="db-card-badge">SDE Intern</span>
                  </div>
                </div>
                <h3 className="db-card-title">Microsoft SDE Internship Experience 2024</h3>
                <p className="db-card-body">Detailed summary of my online test, coding round and interview structure at Microsoft...</p>
                <div className="db-card-foot">
                  <span className="db-card-ctc">24 LPA</span>
                </div>
              </div>
            )}

            {/* 3. Doubt Card (Dynamic or Mock Fallback) */}
            {recommendedItems.firstDoubt ? (
              <DoubtCard item={recommendedItems.firstDoubt} currentUser={currentUser} />
            ) : (
              <div className="db-card db-mock-card">
                <div className="db-card-head">
                  <span className="db-card-badge db-card-badge--subject">DOUBT</span>
                  <div className="db-card-tags">
                    <span className="db-card-badge">Database</span>
                    <span className="db-card-badge">Normalization</span>
                  </div>
                </div>
                <h3 className="db-card-title">How does normalization work in DBMS?</h3>
                <p className="db-card-body">Can someone explain 1NF, 2NF and 3NF with a simple real-world database table example?</p>
                <div className="db-card-foot">
                  <span className="db-card-stat">12 answers · 1h ago</span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── RECENT ACTIVITY ── */}
      <section className="db-home-section">
        <div className="db-section-header-tabs">
          <h2 className="db-section-title">Recent Activity</h2>
          <div className="db-tabs-container">
            <button className={`db-tab-pill ${activeTab === "all" ? "db-tab-pill--active" : ""}`} onClick={() => setActiveTab("all")}>All</button>
            <button className={`db-tab-pill ${activeTab === "doubts" ? "db-tab-pill--active" : ""}`} onClick={() => setActiveTab("doubts")}>Doubts</button>
            <button className={`db-tab-pill ${activeTab === "projects" ? "db-tab-pill--active" : ""}`} onClick={() => setActiveTab("projects")}>Projects</button>
            <button className={`db-tab-pill ${activeTab === "placements" ? "db-tab-pill--active" : ""}`} onClick={() => setActiveTab("placements")}>Placements</button>
          </div>
        </div>

        {filteredActivity.length === 0 ? (
          <EmptyState title="No recent activity" description="No campus activities match your selected filter right now." />
        ) : (
          <div className="db-activity-list">
            {filteredActivity.map((item) => (
              <div key={item.id} className="db-activity-row">
                <div className={`db-activity-badge db-activity-badge--${item.type}`}>
                  {item.type === "doubt" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  )}
                  {item.type === "project" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  )}
                  {item.type === "placement" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  )}
                </div>
                <div className="db-activity-details">
                  <span className="db-activity-msg">
                    <strong>{item.authorName}</strong>{" "}
                    {item.type === "doubt" && "posted a doubt:"}
                    {item.type === "project" && "shared a new project:"}
                    {item.type === "placement" && "shared placement experience:"}{" "}
                    <span className="db-activity-title-link">
                      {item.type === "placement" ? `${item.company} — ${item.role}` : item.title}
                    </span>
                  </span>
                  <span className="db-activity-meta">{timeAgo(item.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── MODALS ── */}
      <CreateDoubtModal open={doubtOpen} onClose={() => setDoubtOpen(false)} userId={userId} userName={userName} />
      <CreateProjectModal open={projectOpen} onClose={() => setProjectOpen(false)} userId={userId} userName={userName} />
      <CreatePlacementModal open={placementOpen} onClose={() => setPlacementOpen(false)} userId={userId} userName={userName} />
    </div>
  );
}

// Simple timeAgo helper (matches hook output)
function timeAgo(ts) {
  if (!ts) return "";
  const ms = ts.toMillis?.() ?? Number(ts);
  const diff = Date.now() - ms;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
