/**
 * content.js — Centralized Firestore write helpers for RiseIQ
 *
 * All mutations that touch sub-collections (answers, comments, votes,
 * bookmarks, spots updates) go through this module so every view stays
 * consistent and the Dashboard shell never needs to touch Firestore ops.
 */

import {
  collection, doc, addDoc, deleteDoc, updateDoc, getDoc,
  query, where, getDocs,
  serverTimestamp, increment, arrayUnion, arrayRemove,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

/* ═══════════════════════════════════════
   ANSWERS  (doubts/{id}/answers)
   ═══════════════════════════════════════ */

/**
 * Post an answer to a doubt and atomically increment answerCount.
 */
export async function addAnswer(doubtId, { authorId, authorName, body }) {
  const answerRef = doc(collection(db, "doubts", doubtId, "answers"));
  const parentRef  = doc(db, "doubts", doubtId);

  await Promise.all([
    addDoc(collection(db, "doubts", doubtId, "answers"), {
      authorId,
      authorName,
      body: body.trim(),
      upvotes: 0,
      upvotedBy: [],
      createdAt: serverTimestamp(),
    }),
    updateDoc(parentRef, { answerCount: increment(1) }),
  ]);
}

/**
 * Toggle upvote on an answer (add user to upvotedBy, increment upvotes).
 * Returns true if upvoted, false if un-upvoted.
 */
export async function toggleAnswerUpvote(doubtId, answerId, userId) {
  const ref = doc(db, "doubts", doubtId, "answers", answerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;

  const data = snap.data();
  const upvotedBy = data.upvotedBy || [];
  const already = upvotedBy.includes(userId);

  if (already) {
    await updateDoc(ref, {
      upvotes: increment(-1),
      upvotedBy: arrayRemove(userId),
    });
    return false;
  } else {
    await updateDoc(ref, {
      upvotes: increment(1),
      upvotedBy: arrayUnion(userId),
    });
    return true;
  }
}

/* ═══════════════════════════════════════
   COMMENTS  (projects|placementStories/{id}/comments)
   ═══════════════════════════════════════ */

/**
 * Post a comment on a project or placement story.
 */
export async function addComment(parentCollection, parentId, { authorId, authorName, body }) {
  await addDoc(collection(db, parentCollection, parentId, "comments"), {
    authorId,
    authorName,
    body: body.trim(),
    createdAt: serverTimestamp(),
  });
}

/**
 * Delete a comment (only by its author).
 */
export async function deleteComment(parentCollection, parentId, commentId) {
  await deleteDoc(doc(db, parentCollection, parentId, "comments", commentId));
}

/* ═══════════════════════════════════════
   BOOKMARKS  (users/{uid}/bookmarks)
   ═══════════════════════════════════════ */

/**
 * Toggle bookmark for a content item.
 * bookmarkDoc = { contentType, contentId, contentTitle }
 */
export async function toggleBookmark(userId, { contentType, contentId, contentTitle, extra }) {
  const col = collection(db, "users", userId, "bookmarks");
  const snap = await getDocs(query(col, where("contentId", "==", contentId), where("contentType", "==", contentType)));

  if (!snap.empty) {
    // Already bookmarked — remove
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    return false; // removed
  } else {
    // Add bookmark
    await addDoc(col, {
      contentType,
      contentId,
      contentTitle: contentTitle || "",
      ...(extra || {}),
      createdAt: serverTimestamp(),
    });
    return true; // added
  }
}

/**
 * Check if a content item is bookmarked by a user.
 */
export async function isBookmarked(userId, contentType, contentId) {
  const snap = await getDocs(
    query(
      collection(db, "users", userId, "bookmarks"),
      where("contentId", "==", contentId),
      where("contentType", "==", contentType),
    )
  );
  return !snap.empty;
}

/* ═══════════════════════════════════════
   PROJECT SPOTS UPDATE
   ═══════════════════════════════════════ */

/**
 * Decrement spotsOpen when someone joins a project.
 */
export async function joinProject(projectId) {
  const ref = doc(db, "projects", projectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Project not found");
  const spotsOpen = snap.data().spotsOpen || 0;
  if (spotsOpen <= 0) throw new Error("No spots left");
  await updateDoc(ref, { spotsOpen: increment(-1) });
}
