/**
 * useDashboardData.js — live Firestore subscriptions for the new dashboard.
 *
 * Replaces the old multi-collection social feed (useFeed). Everything here is
 * scoped to the signed-in user: their projects, certificates, and hackathon
 * participations.
 */

import { useEffect, useState } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";

/** The current user's projects (projects where authorId == uid). */
export function useMyProjects(uid) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setProjects([]); setLoading(false); return; }
    setLoading(true);
    const q = query(
      collection(db, "projects"),
      where("authorId", "==", uid),
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort client-side so we don't need a composite index.
      rows.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      setProjects(rows);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [uid]);

  return { projects, loading };
}

/** The current user's uploaded certificates. */
export function useCertificates(uid) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setCertificates([]); setLoading(false); return; }
    setLoading(true);
    const q = query(
      collection(db, "users", uid, "certificates"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setCertificates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [uid]);

  return { certificates, loading };
}

/** The current user's hackathon participations. */
export function useParticipations(uid) {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setParticipations([]); setLoading(false); return; }
    setLoading(true);
    const q = query(
      collection(db, "users", uid, "participations"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setParticipations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [uid]);

  return { participations, loading };
}

/** Relative time formatter — "3m ago", "2d ago", "12 Jun". */
export function timeAgo(ts) {
  if (!ts) return "";
  const ms = ts.toMillis?.() ?? Number(ts);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
