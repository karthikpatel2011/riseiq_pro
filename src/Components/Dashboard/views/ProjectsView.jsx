import { useState } from "react";
import { useFeed } from "../../../hooks/useFeed";
import ProjectCard from "../cards/ProjectCard";
import EmptyState from "../ui/EmptyState";
import CreateProjectModal from "../modals/CreateProjectModal";
import { useComments } from "../../../hooks/useContent";
import Avatar from "../ui/Avatar";
import CommentComposer from "../cards/CommentComposer";
import { deleteComment } from "../../../lib/content";
import { timeAgo } from "../../../hooks/useFeed";

function CommentThread({ parentCollection, parentId, currentUser }) {
  const { comments, loading } = useComments(parentCollection, parentId);
  const uid = currentUser?.uid;

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    await deleteComment(parentCollection, parentId, commentId);
  };

  return (
    <div className="db-thread">
      {comments.map((c) => (
        <div key={c.id} className="db-thread-row">
          <Avatar name={c.authorName} size={28} />
          <div className="db-thread-body">
            <div className="db-thread-meta">
              <span className="db-thread-author">{c.authorName}</span>
              <span className="db-thread-time">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="db-thread-text">{c.body}</p>
          </div>
          {c.authorId === uid && (
            <button className="db-thread-delete" onClick={() => handleDelete(c.id)} title="Delete comment">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          )}
        </div>
      ))}
      {loading && <p className="db-thread-loading">Loading comments…</p>}
      {comments.length === 0 && !loading && (
        <p className="db-thread-empty">No comments yet.</p>
      )}
      <CommentComposer parentCollection={parentCollection} parentId={parentId} currentUser={currentUser} />
    </div>
  );
}

export default function ProjectsView({ currentUser, userData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { items, loading } = useFeed("projects");

  const userName = userData?.name || currentUser?.displayName || "User";
  const userId = currentUser?.uid;

  return (
    <div className="db-view db-view--projects">
      <div className="db-view-head">
        <div className="db-view-title-row">
          <h2 className="db-view-title">Projects / Teams</h2>
          <button className="db-create-btn" onClick={() => setModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="db-view-loading"><div className="db-view-spinner" /><p>Loading projects…</p></div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Post a project to find teammates and collaborate."
          action={{ label: "Post a Project", onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="db-feed-list">
          {items.map((item) => (
            <div key={item.id}>
              <ProjectCard
                item={item}
                currentUser={currentUser}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
              {expandedId === item.id && (
                <CommentThread parentCollection="projects" parentId={item.id} currentUser={currentUser} />
              )}
            </div>
          ))}
        </div>
      )}

      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} userId={userId} userName={userName} />
    </div>
  );
}
