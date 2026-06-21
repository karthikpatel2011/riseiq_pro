const TRENDING = [
  { id: 1, title: "How does virtual memory work?", subject: "Operating Systems", answers: 12 },
  { id: 2, title: "Difference between HTTP and HTTPS", subject: "Computer Networks", answers: 8 },
  { id: 3, title: "Time complexity of STL containers?", subject: "Data Structures", answers: 6 },
];

function TrendingDoubts() {
  return (
    <div className="dash-widget">
      <div className="dash-widget-head">
        <span className="dash-widget-title">Trending Doubts</span>
      </div>

      {TRENDING.map((item, index) => (
        <div className="dash-trend-item" key={item.id}>
          <span className="dash-trend-rank">{index + 1}</span>
          <div className="dash-trend-body">
            <p className="dash-trend-title">{item.title}</p>
            <p className="dash-trend-meta">{item.subject} · {item.answers} answers</p>
          </div>
        </div>
      ))}

      <button className="dash-widget-link">View all doubts →</button>
    </div>
  );
}

export default TrendingDoubts;
