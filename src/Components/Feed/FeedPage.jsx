import { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useFeed } from "../../hooks/useFeed";

import DashboardSidebar from "./DashboardSidebar";
import DashboardTopNav  from "./DashboardTopNav";
import { WelcomeHero, StatsRow, QuickActions } from "./DashboardSections";
import SkillScoreCard   from "./SkillScoreCard";
import TrendingDoubts   from "./TrendingDoubts";
import TopContributors  from "./TopContributors";
import DoubtCard        from "./DoubtCard";
import ProjectCard      from "./ProjectCard";
import PlacementCard    from "./PlacementCard";
import CreateDoubtModal     from "./CreateDoubtModal";
import CreateProjectModal   from "./CreateProjectModal";
import CreatePlacementModal from "./CreatePlacementModal";
import "./dashboard.css";

const TABS = [
  { key: "all",        label: "All" },
  { key: "doubts",     label: "Doubts" },
  { key: "projects",   label: "Projects" },
  { key: "placements", label: "Placement Stories" },
];

/* ── Inline skeleton matching the dash card shape ── */
function DashSkeleton() {
  return (
    <div className="dash-card dash-skel-card">
      <div className="dash-skel-line" style={{ width: "30%", height: 18, borderRadius: 8 }} />
      <div className="dash-skel-line" style={{ width: "85%", height: 16 }} />
      <div className="dash-skel-line" style={{ width: "60%", height: 12 }} />
      <div className="dash-skel-foot">
        <div className="dash-skel-line" style={{ width: 110, height: 22, borderRadius: 100 }} />
        <div className="dash-skel-line" style={{ width: 70, height: 12 }} />
      </div>
    </div>
  );
}

function EmptyFeed({ filter, onAsk, onPost, onShare }) {
  const map = {
    all:        { title: "Your campus feed starts here", sub: "Ask a question, find teammates, or share an experience with the community.", btn: "Ask a Doubt",      act: onAsk },
    doubts:     { title: "No doubts here yet",           sub: "Stuck on something? A clear question is the fastest way forward.",           btn: "Ask a Doubt",      act: onAsk },
    projects:   { title: "Build something together",     sub: "Post your idea and find students with the skills your project needs.",       btn: "Post a Project",   act: onPost },
    placements: { title: "Be the first to share",        sub: "Your interview experience could make someone else's preparation easier.",   btn: "Share Your Story", act: onShare },
  };
  const m = map[filter] || map.all;
  return (
    <div className="dash-empty">
      <div className="dash-empty-art" aria-hidden="true">
        <span className="dash-empty-bubble dash-empty-bubble--one" />
        <span className="dash-empty-bubble dash-empty-bubble--two" />
        <svg width="92" height="82" viewBox="0 0 92 82" fill="none">
          <rect x="14" y="13" width="64" height="50" rx="12" fill="#fff"/>
          <path d="M28 31h36M28 41h25" stroke="#A99AF5" strokeWidth="4" strokeLinecap="round"/>
          <path d="M35 62l-9 11V59" fill="#fff"/>
          <circle cx="70" cy="18" r="11" fill="#5B43E6"/>
          <path d="M70 13v10M65 18h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="dash-empty-copy">
        <p className="dash-empty-eyebrow">Nothing posted yet</p>
        <p className="dash-empty-title">{m.title}</p>
        <p className="dash-empty-sub">{m.sub}</p>
        <button className="dash-empty-btn" onClick={m.act}>{m.btn} <span>→</span></button>
      </div>
      {filter === "all" && (
        <div className="dash-empty-options">
          <button onClick={onPost}><span className="dash-empty-option-icon dash-empty-option-icon--green">▣</span><span><strong>Find teammates</strong><small>Post a project idea</small></span></button>
          <button onClick={onShare}><span className="dash-empty-option-icon dash-empty-option-icon--orange">◇</span><span><strong>Help others</strong><small>Share your story</small></span></button>
        </div>
      )}
    </div>
  );
}

export default function FeedPage() {
  const { currentUser } = useAuth();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Override the landing page's dark body gradient on this route
  useEffect(() => {
    document.body.style.background = "#F8FAFC";
    return () => { document.body.style.background = ""; };
  }, []);

  const [showDoubt,   setShowDoubt]   = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showPlace,   setShowPlace]   = useState(false);

  const { items, loading, loadingMore, loadMore, hasMore } = useFeed(filter, null);
  const sentinelRef = useRef(null);

  // Load user profile
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) setProfile(snap.data());
      } catch { /* non-fatal */ }
    })();
  }, [currentUser]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (e) => { if (e[0].isIntersecting) loadMore(); },
      { rootMargin: "300px" }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  const userName = profile?.name || currentUser?.displayName || currentUser?.email?.split("@")[0] || "there";

  // Client-side search filter (over the live items)
  const q = search.trim().toLowerCase();
  const visible = !q ? items : items.filter((it) => {
    const hay = [it.title, it.body, it.description, it.experienceSummary, it.company, it.role, it.subject]
      .filter(Boolean).join(" ").toLowerCase();
    return hay.includes(q);
  });

  const renderCard = (item) => {
    const onTap = () => { /* detail routes wired later */ };
    if (item.type === "doubt")     return <DoubtCard     key={item.id} item={item} onTap={onTap} />;
    if (item.type === "project")   return <ProjectCard   key={item.id} item={item} onTap={onTap} />;
    if (item.type === "placement") return <PlacementCard key={item.id} item={item} onTap={onTap} />;
    return null;
  };

  return (
    <div className={`dash-page${sidebarOpen ? " dash-sidebar-open" : ""}`}>
      <DashboardSidebar
        active="home"
        profile={profile}
        completion={profile?.onboardingComplete ? 80 : 40}
        onNavigate={() => setSidebarOpen(false)}
      />

      {/* dim overlay for mobile sidebar */}
      <div className="dash-sidebar-scrim" onClick={() => setSidebarOpen(false)} />

      <div className="dash-main-col">
        <DashboardTopNav
          user={currentUser}
          search={search}
          setSearch={setSearch}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onCreate={() => setShowDoubt(true)}
        />

        <div className="dash-body">
          {/* Center column */}
          <main className="dash-center">
            <WelcomeHero name={userName} gender={profile?.gender} />
            <StatsRow />
            <QuickActions
              user={currentUser}
              onAsk={()   => setShowDoubt(true)}
              onPost={()  => setShowProject(true)}
              onShare={() => setShowPlace(true)}
            />

            {/* Feed */}
            <div className="dash-feed-head">
              <div className="dash-tabs">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    className={`dash-tab${filter === t.key ? " dash-tab--active" : ""}`}
                    onClick={() => setFilter(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button className="dash-filter-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filter
              </button>
            </div>

            <div className="dash-feed">
              {loading ? (
                <>
                  <DashSkeleton /><DashSkeleton /><DashSkeleton />
                </>
              ) : visible.length === 0 ? (
                <EmptyFeed
                  filter={filter}
                  onAsk={()   => setShowDoubt(true)}
                  onPost={()  => setShowProject(true)}
                  onShare={() => setShowPlace(true)}
                />
              ) : (
                <>
                  {visible.map(renderCard)}
                  {hasMore && (
                    <div ref={sentinelRef} className="dash-sentinel">
                      {loadingMore && <DashSkeleton />}
                    </div>
                  )}
                  {!hasMore && <p className="dash-end-note">You're all caught up.</p>}
                </>
              )}
            </div>
          </main>

          {/* Right sidebar */}
          <aside className="dash-right">
            <SkillScoreCard />
            <TrendingDoubts />
            <TopContributors />
          </aside>
        </div>
      </div>

      {/* Modals */}
      <CreateDoubtModal     open={showDoubt}   onClose={() => setShowDoubt(false)}   userId={currentUser?.uid} userName={userName} />
      <CreateProjectModal   open={showProject} onClose={() => setShowProject(false)} userId={currentUser?.uid} userName={userName} />
      <CreatePlacementModal open={showPlace}   onClose={() => setShowPlace(false)}   userId={currentUser?.uid} userName={userName} />
    </div>
  );
}
