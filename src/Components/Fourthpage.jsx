import React from "react";
import StatCard2 from "./StatCard2";

const defaultCards = [
  {
    id: "profile",
    titleLines: ["Verified", "Skill Profile"],
    subtitle: "Your proof of work, on the record",
    bullets: [
      "Add projects, certificates & hackathons",
      "Get peer & faculty verification",
      "Build a skill score that proves real ability",
      "Replace self-reported claims with actual proof",
    ],
    buttonLabel: "Build Profile",
  },
  {
    id: "doubt-mentor",
    titleLines: ["Doubt-to-", "Mentor"],
    subtitle: "Learn by asking. Rise by answering.",
    bullets: [
      "Post doubts, get answers from peers & seniors",
      "Every answer you give builds your skill score",
      "Top answerers earn visibility on the platform",
      "Turns Q&A into a public proof of expertise",
    ],
    buttonLabel: "Ask a Doubt",
  },
  {
    id: "project-match",
    titleLines: ["Project", "Co-founder Match"],
    subtitle: "Find teammates who actually know their stuff",
    bullets: [
      "Matching uses verified skills — not just bios",
      "Doubt activity shows who really knows their domain",
      "Filter by skill, year, college & availability",
      "Build real projects with the right people",
    ],
    buttonLabel: "Find Co-founders",
  },
  {
    id: "placement-intel",
    titleLines: ["Placement", "Intelligence"],
    subtitle: "Real outcomes from real skill profiles",
    bullets: [
      "Anonymized data from alumni placements",
      "Interview experiences tied to real skill profiles",
      "See what skills led to what outcomes",
      "Juniors get verified intel — not random noise",
    ],
    buttonLabel: "View Intel",
  },
];

function Fourthpage({ cards = defaultCards, heading, subheading }) {
  return (
    <section className="thirdmain2">
      <div className="thirpge">
        <h1>
          {heading ?? (
            <>
              Four Features. <span className="MAS">One Flywheel.</span>
              <br />
              All Feeding Each Other.
            </>
          )}
        </h1>
        <p>
          {subheading ?? (
            <>
              Each feature generates data the others need. Doubt-solving proves skill
              → project matching uses that → placement outcomes prove it mattered.{" "}
              <span className="rise">RiseIQ</span> is the campus OS that ties it all together.
            </>
          )}
        </p>
      </div>
      <div className="hh">
        {cards.map((card) => (
          <StatCard2
            key={card.id}
            titleLines={card.titleLines}
            subtitle={card.subtitle}
            bullets={card.bullets}
            buttonLabel={card.buttonLabel}
            onExplore={card.onExplore}
          />
        ))}
      </div>
    </section>
  );
}

export default Fourthpage;
