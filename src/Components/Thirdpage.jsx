import React from "react";
import StatCard from "./StatCard";

const defaultCards = [
  {
    id: "disconnected",
    titleLines: ["4+ Apps", "Zero", "Connection"],
    description:
      "Students juggle LinkedIn, WhatsApp groups, random forums, and Excel sheets — none of which talk to each other.",
    buttonLabel: "Explore",
  },
  {
    id: "unverified",
    titleLines: ["0%", "Skills", "Verified"],
    description:
      "Every resume says 'Python' and 'team player'. There's no peer or faculty verification — just self-reported claims no one trusts.",
    buttonLabel: "Explore",
  },
  {
    id: "projects",
    titleLines: ["70%", "Campus Projects", "Fall Apart"],
    description:
      "Most student project teams break up due to skill mismatch. There's no data-driven way to find the right co-founder on campus.",
    buttonLabel: "Explore",
  },
  {
    id: "solution",
    titleLines: ["1", "Platform.", "All Connected."],
    description:
      "RiseIQ links your verified profile, doubt-solving, project matching, and real placement data into one intelligent flywheel.",
    buttonLabel: "Explore",
  },
];

function Thirdpage({ cards = defaultCards, heading, subheading }) {
  return (
    <section className="thirdmain">
      <div className="thirpge">
        <h1>
          {heading ?? (
            <>
              The Problem is <span className="MAS">Fragmented.</span>
              <br />
              We Built the Fix.
            </>
          )}
        </h1>
        <p>
          {subheading ?? (
            <>
              Students are drowning in disconnected tools with no verified proof of skill.{" "}
              <span className="rise">RiseIQ</span> connects everything into one campus OS.
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

export default Thirdpage;
