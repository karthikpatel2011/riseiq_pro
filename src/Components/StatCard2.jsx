import React from "react";

function StatCard2({
  titleLines,
  subtitle,
  bullets = [],
  buttonLabel = "Explore",
  onExplore,
}) {
  return (
    <article className="card1">
      <h2 className="card1-title">
        {titleLines.map((line, index) => (
          <React.Fragment key={`${line}-${index}`}>
            {line}
            {index < titleLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>
      {subtitle && <p className="card1-subtitle">{subtitle}</p>}
      <ul className="card1-bullets">
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="card1-footer">
        <button type="button" className="card1-btn" onClick={onExplore}>
          {buttonLabel}
        </button>
      </div>
    </article>
  );
}

export default StatCard2;
