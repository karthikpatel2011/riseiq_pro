import React from "react";

function StatCard({ titleLines, description, buttonLabel = "Explore", onExplore }) {
  return (
    <article className="card3">
      <h2 className="card3-title">
        {titleLines.map((line, index) => (
          <React.Fragment key={`${line}-${index}`}>
            {line}
            {index < titleLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>
      <p className="card3-text">{description}</p>
      <div className="but3">
      </div>
    </article>
  );
}

export default StatCard;
