const BRANCHES = ["CSE", "ECE", "EEE", "IT", "Mechanical", "Civil", "Chemical", "Biotech", "Aerospace", "Other"];

export { BRANCHES };

export default function BranchFilter({ value, onChange }) {
  return (
    <div className="db-branch-filter">
      <button
        className={`db-branch-chip${value === null ? " db-branch-chip--active" : ""}`}
        onClick={() => onChange(null)}
      >
        All Branches
      </button>
      {BRANCHES.map((b) => (
        <button
          key={b}
          className={`db-branch-chip${value === b ? " db-branch-chip--active" : ""}`}
          onClick={() => onChange(value === b ? null : b)}
        >
          {b}
        </button>
      ))}
    </div>
  );
}
