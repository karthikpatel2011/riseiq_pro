function SkillScoreCard() {
  const circumference = 2 * Math.PI * 44;
  const offset = circumference * (1 - 0.82);

  const chips = [
    { name: "DSA", val: 780 },
    { name: "React", val: 820 },
    { name: "Node.js", val: 750 },
    { name: "System Design", val: 700 },
  ];

  return (
    <div className="dash-widget dash-skill">
      <div className="dash-widget-head">
        <span className="dash-widget-title">Your Skill Score</span>
        <span className="dash-widget-info">ⓘ</span>
      </div>

      <div className="dash-skill-ring-wrap">
        <div className="dash-skill-ringbox">
          <svg width="104" height="104">
            <circle
              cx="52"
              cy="52"
              r="44"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
            />
            <circle
              cx="52"
              cy="52"
              r="44"
              fill="none"
              stroke="#6366F1"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 52 52)"
            />
          </svg>
          <div className="dash-skill-center">
            <span className="dash-skill-score">820</span>
            <span className="dash-skill-level">Excellent</span>
          </div>
        </div>
        <div className="dash-skill-growth">
          <span className="dash-skill-growth-val">↑ 42</span>
          <span className="dash-skill-growth-label">This month</span>
        </div>
      </div>

      <div className="dash-skill-chips">
        {chips.map((chip) => (
          <div className="dash-skill-chip" key={chip.name}>
            <span className="dash-skill-chip-name">{chip.name}</span>
            <span className="dash-skill-chip-val">{chip.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillScoreCard;
