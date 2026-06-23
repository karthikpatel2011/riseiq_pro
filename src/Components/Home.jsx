import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Semi from "../assets/Seminar-amico.png";
import Mouse from "../assets/mouse.png";

function Home() {
  const navigate = useNavigate();
  const { currentUser, onboardingComplete } = useAuth();

  const handleStart = () => {
    if (currentUser) {
      navigate(onboardingComplete ? "/dashboard" : "/onboarding");
    } else {
      navigate("/?auth=signup");
    }
  };

  return (
    <>
      <div className="cents">
        <div className="mainimg">
          <div className="mainimg-inner">
            <img src={Semi} alt="Learning illustration" />
          </div>
        </div>
        <div className="main1">
          <h1>
            One Profile.<span className="sub"> Four Superpowers.</span>
            <br />
            <span className="f">RiseIQ </span>— Your <span>Campus OS.</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(0.9rem,2vw,1.05rem)",
              marginTop: "0.75rem",
              maxWidth: "480px",
              lineHeight: "1.6",
            }}
          >
            Verify your skills. Answer doubts. Find co-founders. Land placements
            — all on one platform where every feature feeds the next.
          </p>
          <div className="start">
            <button className="but11" onClick={handleStart}>
              {currentUser ? "Go to Dashboard" : "Get Started Free"}
            </button>
            <button
              className="but22"
              onClick={() => {
                const el = document.getElementById("how-it-works");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              How It Works
            </button>
          </div>
          <div className="mouse">
            <img src={Mouse} alt="scroll down" />
            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
