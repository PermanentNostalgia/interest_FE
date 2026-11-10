import "./info.css";

export default function Info({ name, onContinue }) {
  const greeting = (
    <>
      안녕하세요,
      <br />
      {name}님
    </>
  )

  return (
    <main className="info-screen">
      <div className="info-background" aria-hidden="true" />

      {onContinue ? (
        <button
          className="info-continue"
          type="button"
          onClick={onContinue}
          aria-label="튜토리얼로 이동"
        >
          <span className="info-greeting">{greeting}</span>
        </button>
      ) : (
        <div className="info-greeting">{greeting}</div>
      )}

      <div className="info-tabbar" aria-hidden="true">
        <div className="info-home-indicator" />
      </div>
    </main>
  );
}
