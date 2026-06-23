import { useState } from "react";
import { useFeed } from "../../../hooks/useFeed";
import DoubtCard from "../cards/DoubtCard";
import BranchFilter from "../ui/BranchFilter";
import EmptyState from "../ui/EmptyState";
import CreateDoubtModal from "../modals/CreateDoubtModal";
import { useAnswers } from "../../../hooks/useContent";
import Avatar from "../ui/Avatar";
import LikeButton from "../ui/LikeButton";
import AnswerComposer from "../cards/AnswerComposer";
import { timeAgo } from "../../../hooks/useFeed";
import { toggleAnswerUpvote } from "../../../lib/content";

function AnswerThread({ doubtId, currentUser }) {
  const { answers, loading } = useAnswers(doubtId);
  const uid = currentUser?.uid;

  return (
    <div className="db-thread">
      {answers.map((a) => {
        const isOwn = a.authorId === uid;
        const hasVoted = (a.upvotedBy || []).includes(uid);

        return (
          <div key={a.id} className="db-thread-row">
            <Avatar name={a.authorName} size={28} />
            <div className="db-thread-body">
              <div className="db-thread-meta">
                <span className="db-thread-author">{a.authorName}</span>
                <span className="db-thread-time">{timeAgo(a.createdAt)}</span>
              </div>
              <p className="db-thread-text">{a.body}</p>
              <LikeButton
                count={a.upvotes || 0}
                active={hasVoted}
                onClick={() => toggleAnswerUpvote(doubtId, a.id, uid)}
                size={15}
              />
            </div>
          </div>
        );
      })}
      {loading && <p className="db-thread-loading">Loading answers…</p>}
      {answers.length === 0 && !loading && (
        <p className="db-thread-empty">No answers yet. Be the first to help!</p>
      )}
      <AnswerComposer doubtId={doubtId} currentUser={currentUser} />
    </div>
  );
}

export default function DoubtsView({ currentUser, userData }) {
  const [branch, setBranch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { items, loading } = useFeed("doubts", branch);

  const userName = userData?.name || currentUser?.displayName || "User";
  const userId = currentUser?.uid;

  return (
    <div className="db-view db-view--doubts">
      <div className="db-view-head">
        <div className="db-view-title-row">
          <h2 className="db-view-title">Doubts</h2>
          <button className="db-create-btn" onClick={() => setModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ask
          </button>
        </div>
        <BranchFilter value={branch} onChange={setBranch} />
      </div>

      {loading ? (
        <div className="db-view-loading"><div className="db-view-spinner" /><p>Loading doubts…</p></div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No doubts yet"
          description="Ask the community a question and get help from peers and seniors."
          action={{ label: "Ask a Doubt", onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="db-feed-list">
          {items.map((item) => (
            <div key={item.id}>
              <DoubtCard
                item={item}
                currentUser={currentUser}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
              {expandedId === item.id && (
                <AnswerThread doubtId={item.id} currentUser={currentUser} />
              )}
            </div>
          ))}
        </div>
      )}

      <CreateDoubtModal open={modalOpen} onClose={() => setModalOpen(false)} userId={userId} userName={userName} />
    </div>
  );
}
