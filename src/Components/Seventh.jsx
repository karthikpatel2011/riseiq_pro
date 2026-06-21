import React from "react";

function Seventh() {
    const features = [
      {
        title: "Bulk Accounts",
        desc: "Onboard 100s of students or employees at once",
      },
      {
        title: "Admin Dashboard",
        desc: "Track cohort progress, skill gaps, and placement rates",
      },
      {
        title: "Branded Platform",
        desc: "Full white-label experience under your institution's name",
      },
      {
        title: "Custom Goal Tracks",
        desc: "Configure exam paths, job tracks, and MBA prep flows",
      },
      {
        title: "Dedicated Manager",
        desc: "A named account manager for every enterprise client",
      },
      {
        title: "API & Integrations",
        desc: "Connect with your existing LMS, HRMS, or ERP systems",
      },
    ];
  
    return (
        <>
        <div className="mainpage0">
            <div className="copo">
                <h1>Institutions & Corporate<br></br><span className="ri">RiseIq </span>Is here.</h1>
                <p>We provide the best institutional perks</p>
            </div>
      <section className="enterprise-card">
        <div className="left">
          <span className="tag">For Organizations</span>
  
          <h1>Corporate & Institutional</h1>
  
          <p>
            Built for universities, coaching institutes, HR teams,
            and corporate L&D departments.
          </p>
  
          <h2>Custom</h2>
  
          <p>Pricing based on team size</p>
  
          <button>Contact Sales</button>
  
          <small>Response within 24 hours</small>
        </div>
  
        <div className="right">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="icon">✓</div>
  
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
      </>
    );
  }
  
  export default Seventh;