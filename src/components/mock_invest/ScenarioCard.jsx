function LockIcon() {
  return (
    <svg
      className="mock-lock"
      viewBox="0 0 20 22"
      width="20"
      height="22"
      aria-hidden="true"
    >
      <path
        d="M6 9V6.5a4 4 0 0 1 8 0V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="2" y="9" width="16" height="11" rx="2.5" fill="currentColor" />
    </svg>
  );
}

export default function ScenarioCard({ scenario, index, onSelect }) {
  const { title, topic, locked, unlockHint } = scenario;

  return (
    <article className={"mock-scenario-card" + (locked ? " locked" : "")}>
      {locked ? <LockIcon /> : <span className="mock-open-tag">열림</span>}
      <p className="mock-scenario-no">시나리오 {index + 1}</p>
      <h2>{title}</h2>
      {!locked && <p className="mock-scenario-topic">{topic}</p>}
      <button
        className="mock-cta"
        disabled={locked}
        onClick={() => onSelect(scenario)}
      >
        {locked ? unlockHint : "시작하기"}
      </button>
    </article>
  );
}
