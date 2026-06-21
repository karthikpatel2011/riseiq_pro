import { useState, useEffect, useMemo, useRef } from "react";
import {
  collection, query, orderBy, limit as fsLimit,
  where, onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const PAGE = 15; // items loaded per collection per batch

/**
 * useFeed — merges three live Firestore collections into one sorted feed.
 *
 * @param {string}      filter  "all" | "doubts" | "projects" | "placements"
 * @param {string|null} branch  branch name to filter by, or null for all
 * @returns {{ items, loading, loadingMore, loadMore, hasMore }}
 */
export function useFeed(filter = "all", branch = null) {
  const [doubts,     setDoubts]     = useState([]);
  const [projects,   setProjects]   = useState([]);
  const [placements, setPlacements] = useState([]);
  const [pageLimit,  setPageLimit]  = useState(PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  // Track which collection types are still loading for the current subscription set
  const pendingRef = useRef(new Set());
  const [loading, setLoading] = useState(true);

  const wantDoubts    = filter === "all" || filter === "doubts";
  const wantProjects  = filter === "all" || filter === "projects";
  const wantPlacements = filter === "all" || filter === "placements";

  useEffect(() => {
    const unsubs = [];
    const pending = new Set();
    if (wantDoubts)     pending.add("doubts");
    if (wantProjects)   pending.add("projects");
    if (wantPlacements) pending.add("placements");
    pendingRef.current = pending;
    setLoading(true);

    // Reset collections that are no longer needed
    if (!wantDoubts)     setDoubts([]);
    if (!wantProjects)   setProjects([]);
    if (!wantPlacements) setPlacements([]);

    const markLoaded = (key) => {
      pendingRef.current.delete(key);
      if (pendingRef.current.size === 0) setLoading(false);
    };

    if (wantDoubts) {
      let q = query(
        collection(db, "doubts"),
        orderBy("createdAt", "desc"),
        fsLimit(pageLimit),
      );
      if (branch) q = query(q, where("branch", "==", branch));
      unsubs.push(
        onSnapshot(q, (snap) => {
          setDoubts(snap.docs.map((d) => ({ id: d.id, type: "doubt", ...d.data() })));
          markLoaded("doubts");
        }, () => markLoaded("doubts"))
      );
    }

    if (wantProjects) {
      const q = query(
        collection(db, "projects"),
        orderBy("createdAt", "desc"),
        fsLimit(pageLimit),
      );
      unsubs.push(
        onSnapshot(q, (snap) => {
          setProjects(snap.docs.map((d) => ({ id: d.id, type: "project", ...d.data() })));
          markLoaded("projects");
        }, () => markLoaded("projects"))
      );
    }

    if (wantPlacements) {
      let q = query(
        collection(db, "placementStories"),
        orderBy("createdAt", "desc"),
        fsLimit(pageLimit),
      );
      if (branch) q = query(q, where("branch", "==", branch));
      unsubs.push(
        onSnapshot(q, (snap) => {
          setPlacements(snap.docs.map((d) => ({ id: d.id, type: "placement", ...d.data() })));
          markLoaded("placements");
        }, () => markLoaded("placements"))
      );
    }

    return () => {
      unsubs.forEach((u) => u());
      pendingRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, branch, pageLimit]);

  // Merge + sort client-side by createdAt desc
  const items = useMemo(() => {
    const merged = [];
    if (wantDoubts)     merged.push(...doubts);
    if (wantProjects)   merged.push(...projects);
    if (wantPlacements) merged.push(...placements);
    return merged.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0;
      const bt = b.createdAt?.toMillis?.() ?? 0;
      return bt - at;
    });
  }, [doubts, projects, placements, wantDoubts, wantProjects, wantPlacements]);

  // Rough "has more" — if any active collection returned a full page
  const hasMore =
    (wantDoubts     && doubts.length     >= pageLimit) ||
    (wantProjects   && projects.length   >= pageLimit) ||
    (wantPlacements && placements.length >= pageLimit);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setPageLimit((l) => l + PAGE);
    setLoadingMore(false);
  };

  return { items, loading, loadingMore, loadMore, hasMore };
}

/**
 * Relative time formatter  e.g. "3 min ago", "2 days ago"
 */
export function timeAgo(ts) {
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
