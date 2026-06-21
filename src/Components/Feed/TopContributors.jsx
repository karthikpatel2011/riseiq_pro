const CONTRIBUTORS = [
  { id: 1, name: "Aditya Patel", meta: "CSE · 4th Year", xp: 1250 },
  { id: 2, name: "Priya Nair",   meta: "IT · 3rd Year",  xp: 980 },
  { id: 3, name: "Rohit Sharma", meta: "ME · 4th Year",  xp: 870 },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function TopContributors() {
  return (
    <div className="dash-widget">
      <div className="dash-widget-head">
        <span className="dash-widget-title">Top Contributors</span>
      </div>

      {CONTRIBUTORS.map((contributor, index) => (
        <div className="dash-contrib-item" key={contributor.id}>
          <span className="dash-contrib-rank">{index + 1}</span>
          <div className="dash-contrib-avatar">{getInitials(contributor.name)}</div>
          <div className="dash-contrib-body">
            <p className="dash-contrib-name">{contributor.name}</p>
            <p className="dash-contrib-meta">{contributor.meta}</p>
          </div>
          <span className="dash-contrib-xp">{contributor.xp.toLocaleString()}</span>
        </div>
      ))}

      <button className="dash-widget-link">View leaderboard →</button>
    </div>
  );
}

export default TopContributors;
