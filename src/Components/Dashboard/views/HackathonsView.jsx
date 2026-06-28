import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { HACKATHONS } from "../data/seed";
import { useParticipations } from "../../../hooks/useDashboardData";
import { CertificateList } from "./CertificatesView";

function fmtDate(d) {
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}

export default function HackathonsView({ currentUser, sub = "discover" }) {
  const uid = currentUser?.uid;
  const { participations } = useParticipations(uid);
  const [busy, setBusy] = useState(null);

  const joinedIds = new Set(participations.map((p) => p.hackathonId));

  const register = async (h) => {
    if (!uid || joinedIds.has(h.id)) return;
    setBusy(h.id);
    try {
      await addDoc(collection(db, "users", uid, "participations"), {
        hackathonId: h.id, name: h.name, organizer: h.organizer,
        status: "registered", createdAt: serverTimestamp(),
      });
    } catch (e) { console.error(e); }
    setBusy(null);
  };

  const withdraw = async (p) => {
    if (!confirm(`Withdraw from "${p.name}"?`)) return;
    await deleteDoc(doc(db, "users", uid, "participations", p.id));
  };

  /* ── My Participations ── */
  if (sub === "participations") {
    return (
      <div className="dn-view">
        <div className="dn-view-head">
          <h1 className="dn-view-title">My participations</h1>
          <p className="dn-view-sub">Hackathons you've registered for.</p>
        </div>
        {participations.length === 0 ? (
          <div className="dn-empty">
            <div className="dn-empty-ico"><TrophyIcon /></div>
            <p className="dn-empty-title">No participations yet</p>
            <p className="dn-empty-desc">Register for a hackathon from Discover to see it here.</p>
          </div>
        ) : (
          <div className="dn-list">
            {participations.map((p) => (
              <div key={p.id} className="dn-cert">
                <div className="dn-cert-ico"><TrophyIcon /></div>
                <div className="dn-cert-body">
                  <p className="dn-cert-name">{p.name}</p>
                  <p className="dn-cert-issuer">{p.organizer}</p>
                </div>
                <span className="dn-badge dn-badge--active">{p.status || "registered"}</span>
                <button className="dn-icon-btn dn-icon-btn--danger" onClick={() => withdraw(p)} title="Withdraw">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Hackathon certificates ── */
  if (sub === "certificates") {
    return (
      <div className="dn-view">
        <div className="dn-view-head">
          <h1 className="dn-view-title">Hackathon certificates</h1>
          <p className="dn-view-sub">Certificates you've uploaded with type “hackathon”.</p>
        </div>
        <CertificateList uid={uid} filterType="hackathon" />
      </div>
    );
  }

  /* ── Discover ── */
  return (
    <div className="dn-view">
      <div className="dn-view-head">
        <h1 className="dn-view-title">Discover hackathons</h1>
        <p className="dn-view-sub">Find and register for hackathons happening now.</p>
      </div>
      <div className="dn-grid">
        {HACKATHONS.map((h) => {
          const joined = joinedIds.has(h.id);
          return (
            <div key={h.id} className="dn-card dn-card--hover dn-hack" style={{ borderTopColor: h.color }}>
              <p className="dn-hack-org">{h.organizer}</p>
              <h3 className="dn-proj-title">{h.name}</h3>
              <div className="dn-hack-row">
                <span><b>{h.mode}</b></span>
                <span>🏆 <b>{h.prize}</b></span>
                <span>Due <b>{fmtDate(h.deadline)}</b></span>
              </div>
              <div className="dn-tags" style={{ marginBottom: 16 }}>
                {h.tags.map((t) => <span key={t} className="dn-tag">{t}</span>)}
              </div>
              <button
                className={`dn-btn dn-btn-sm ${joined ? "" : "dn-btn-primary"}`}
                onClick={() => register(h)}
                disabled={joined || busy === h.id}
              >
                {joined ? "✓ Registered" : busy === h.id ? "Registering…" : "Register"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>
);
