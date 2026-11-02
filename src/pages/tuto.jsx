import "./tuto.css";

const introParts = [
  {
    part: "A Part",
    title: "배우고",
    description: "금융 용어 배우기",
  },
  {
    part: "B Part",
    title: "써먹고",
    description: "배운 내용으로 모의투자 해보기",
  },
];

function IntroCard({ part, title, description }) {
  return (
    <section className="tuto-card" aria-label={`${part}: ${title}`}>
      <p className="tuto-card-part">{part}</p>
      <h2 className="tuto-card-title">{title}</h2>
      <p className="tuto-card-description">{description}</p>
    </section>
  );
}

export default function Tuto({ onContinue }) {
  return (
    <main className="tuto-screen">
      <div className="tuto-background" aria-hidden="true">
        <span className="tuto-glow tuto-glow--one" />
        <span className="tuto-glow tuto-glow--two" />
        <span className="tuto-glow tuto-glow--three" />
        <span className="tuto-glow tuto-glow--four" />
      </div>

      <header className="tuto-heading">
        <p>배우고, 써먹고</p>
        <h1>이렇게 진행돼요</h1>
      </header>

      <div className="tuto-cards">
        {introParts.map((item) => (
          <IntroCard key={item.part} {...item} />
        ))}
      </div>

      <button
        className="tuto-continue"
        type="button"
        onClick={onContinue}
      >
        시작해볼게요
      </button>

      <div className="tuto-tabbar" aria-hidden="true">
        <div className="tuto-home-indicator" />
      </div>
    </main>
  );
}
