import { useState, useEffect } from "react";
import {
  collection, query, orderBy, onSnapshot,
  doc, onSnapshot as onDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Live-subscribe to a user's bookmarks, grouped by contentType.
 * Returns { items:[], loading, byType:{ doubts:[], projects:[], placements:[] } }
 */
export function useBookmarks(userId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const q = query(
      collection(db, "users", userId, "bookmarks"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [userId]);

  const byType = {
    doubts: items.filter((i) => i.contentType === "doubt"),
    projects: items.filter((i) => i.contentType === "project"),
    placements: items.filter((i) => i.contentType === "placement"),
  };

  return { items, loading, byType };
}

/**
 * Live-subscribe to answers for a single doubt.
 * Returns { answers:[], loading }
 */
export function useAnswers(doubtId) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doubtId) { setLoading(false); return; }
    const q = query(
      collection(db, "doubts", doubtId, "answers"),
      orderBy("upvotes", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setAnswers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [doubtId]);

  return { answers, loading };
}

/**
 * Live-subscribe to comments for a project or placement story.
 * Returns { comments:[], loading }
 */
export function useComments(parentCollection, parentId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentCollection || !parentId) { setLoading(false); return; }
    const q = query(
      collection(db, parentCollection, parentId, "comments"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [parentCollection, parentId]);

  return { comments, loading };
}
