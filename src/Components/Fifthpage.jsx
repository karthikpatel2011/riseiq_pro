import React from "react";
import StatCard from "./StatCard3";

const defaultCards = [
    
  {
    id: "step1",
    titleLines: [<span className="step">Step-1</span>,<span className="jj">Build Your Verified Profile</span>],
    description:
      "Add your projects, certifications, and hackathons. Get peer and faculty verification in under 3 minutes. Your skills go on the record — no more self-reported claims.",
    buttonLabel: "Explore",
  },
  {
    id: "step2",
    titleLines: [<span className="step">Step-2</span>,<span className="jj">Prove Skills & Learn</span>],
    description:
      "Ask doubts, answer others, and watch your skill score grow with every interaction. Real proof of expertise — visible to co-founders, mentors, and recruiters.",
    buttonLabel: "Explore",
  },
  {
    id: "step3",
    titleLines: [<span className="step">Step-3</span>,<span className="jj">Match, Rise & Give Back</span>],
    description:
      "Match with project co-founders using real skill data. Access placement intelligence from verified alumni. Get placed — then guide the next batch.",
    buttonLabel: "Explore",
  },
];

function Fifthpage({ cards = defaultCards, heading, subheading }) {
  return (
    <section className="fifthmain">
      <div className="thirpge">
        <h1>
          {heading ?? (
            <>
              From Profile to Placement <span className="MAS">in 3 Steps.</span>
              <br />
              RiseIQ Makes It Real.
            </>
          )}
        </h1>
        <p>
          {subheading ?? (
            <>
              No disconnected tools. No unverified claims. One unified path from campus to career.{" "}
              <span className="rise">RiseIQ</span> walks with you.
            </>
          )}
        </p>
      </div>
      <div className="hh">
        {cards.map((card) => (
          <StatCard
            key={card.id}
            titleLines={card.titleLines}
            description={card.description}
            buttonLabel={card.buttonLabel}
            onExplore={card.onExplore}
          />
        ))}
      </div>
    </section>
  );
}

export default Fifthpage;
