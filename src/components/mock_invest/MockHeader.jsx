export function BackButton({ onClick }) {
  return (
    <button className="mock-back" onClick={onClick} aria-label="뒤로">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path
          d="M15 5l-7 7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function MockHeader({ eyebrow, title, onBack }) {
  return (
    <header className="mock-header">
      {onBack && <BackButton onClick={onBack} />}
      {eyebrow && <p>{eyebrow}</p>}
      <h1>{title}</h1>
    </header>
  );
}
