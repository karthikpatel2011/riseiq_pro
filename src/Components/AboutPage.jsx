import React from "react";
import Navbar from "./Navbar";
import Footer1 from "./Footer1";
import teja from "../assets/teja.jpg";
import karthik from "../assets/karthik.png";

const team = [
  { img: teja,    name: "Teja",    role: "Founder & CEO",     bio: "Visionary builder passionate about bridging the gap between education and employment." },
  { img: karthik, name: "Karthik", role: "Co-Founder & CTO",  bio: "Engineer at heart, building the AI backbone that powers every student's career journey." },
];

const stats = [
  { value: "10K+",  label: "Students Empowered" },
  { value: "500+",  label: "Companies Onboarded" },
  { value: "94%",   label: "Placement Rate" },
  { value: "3 Min", label: "Avg. Time to Match" },
];

const values = [
  { icon: "◈", title: "Student First",   desc: "Every decision starts and ends with what's best for the student." },
  { icon: "◉", title: "Radical Clarity", desc: "No jargon, no fluff. Clear roadmaps and honest feedback always." },
  { icon: "⊞", title: "Meritocracy",     desc: "Your skills speak louder than your college name or city." },
  { icon: "◐", title: "Community Power", desc: "Peer learning, mentors, and cohorts — growing together beats grinding alone." },
  { icon: "⤳", title: "Speed to Impact", desc: "Faster feedback loops, faster placements, faster career growth." },
  { icon: "◑", title: "Continuous Growth",desc: "Learning never stops. Neither do we." },
];

function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="ab-hero">
        <div className="ab-hero-inner">
          <div className="ab-hero-text">
            <span className="ab-kicker">About RiseIQ</span>
            <h1>Where Talent<br />Meets Opportunity</h1>
            <p>
              RiseIQ is the largest community engagement platform built to help
              talent be unstoppable — from first internship to dream career.
            </p>
            <div className="ab-hero-actions">
              <button className="ab-btn-primary">Join for Free</button>
              <button className="ab-btn-ghost">Sign In</button>
            </div>
          </div>

          <div className="ab-team-grid">
            {team.map((m, i) => (
              <div key={i} className="ab-team-card">
                <div className="ab-team-photo">
                  <img src={m.img} alt={m.name} />
                </div>
                <div className="ab-team-meta">
                  <h3>{m.name}</h3>
                  <span>{m.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="ab-stats">
        {stats.map((s, i) => (
          <div key={i} className="ab-stat">
            <span className="ab-stat-value">{s.value}</span>
            <span className="ab-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── MISSION ──────────────────────────────────────── */}
      <section className="ab-mission">
        <div className="ab-mission-inner">
          <div className="ab-mission-tag">Our Mission</div>
          <h2>
            We believe every student deserves a<br />
            <span>fair shot at their dream career.</span>
          </h2>
          <p>
            The hiring system is broken. Talented people get filtered out by irrelevant criteria — wrong college,
            wrong city, wrong connections. RiseIQ levels the playing field with AI-powered skill mapping, job
            matching, and mentorship that actually moves the needle.
          </p>
        </div>
        <div className="ab-mission-cards">
          <div className="ab-mission-card">
            <div className="ab-mc-icon">◈</div>
            <h4>Skill-First Hiring</h4>
            <p>We map your real capabilities — not just your resume keywords — to roles that actually fit.</p>
          </div>
          <div className="ab-mission-card ab-mission-card--accent">
            <div className="ab-mc-icon">⤳</div>
            <h4>Guided Roadmaps</h4>
            <p>Week-by-week action plans built around your goal, your timeline, and your current level.</p>
          </div>
          <div className="ab-mission-card">
            <div className="ab-mc-icon">◉</div>
            <h4>Real Community</h4>
            <p>Peers, mentors, and alumni who've walked the path — not just a Discord with crickets.</p>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────── */}
      <section className="ab-values">
        <div className="ab-values-inner">
          <span className="ab-kicker ab-kicker--light">What We Stand For</span>
          <h2>Our Core Values</h2>
          <div className="ab-values-grid">
            {values.map((v, i) => (
              <div key={i} className="ab-value-card">
                <span className="ab-value-icon">{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <section className="ab-founders">
        <div className="ab-founders-inner">
          <span className="ab-kicker">The People Behind RiseIQ</span>
          <h2>Built by people who felt the gap</h2>
          <p className="ab-founders-sub">
            We were those students — confused, overlooked, grinding without direction. So we built what we wish existed.
          </p>
          <div className="ab-founders-grid">
            {team.map((m, i) => (
              <div key={i} className="ab-founder-card">
                <div className="ab-founder-photo">
                  <img src={m.img} alt={m.name} />
                </div>
                <h3>{m.name}</h3>
                <span className="ab-founder-role">{m.role}</span>
                <p className="ab-founder-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="ab-cta">
        <div className="ab-cta-inner">
          <h2>Ready to Rise?</h2>
          <p>Join thousands of students already building their career with RiseIQ.</p>
          <button className="ab-btn-primary ab-btn-large">
            Get Started — It's Free
          </button>
        </div>
      </section>

      <Footer1 />
    </>
  );
}

export default AboutPage;
