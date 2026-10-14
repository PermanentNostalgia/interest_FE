import { useState } from "react";
import "./tuto.css";

const knowledgeLevels = [
  {
    title: "잘몰라요",
    description: "처음부터 차근차근 배울래요",
  },
  {
    title: "거시경제 용어 정도는 알아요",
    description: "예) 금리, 채권",
  },
  {
    title: "저 정도면 전문가죠",
    description: "투자자산운용사 보유",
  },
];

function StatusIcons() {
  return (
    <span className="tuto-status-icons" aria-hidden="true">
      <svg viewBox="0 0 18 12">
        <path d="M1 11V8h3v3M6 11V6h3v5m2 0V3h3v8m2 0V1h3v10" />
      </svg>
      <svg viewBox="0 0 17 13">
        <path d="M1 4.5C5.3.8 11.7.8 16 4.5L8.5 12 1 4.5Z" />
      </svg>
      <svg className="tuto-battery" viewBox="0 0 28 14">
        <rect x=".75" y=".75" width="24" height="12.5" rx="3.5" />
        <path d="M26.5 4.5v5" />
        <rect className="tuto-battery-fill" x="3" y="3" width="19" height="8" rx="2" />
      </svg>
    </span>
  );
}

export default function Tuto({ onSelect }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  function selectLevel(index) {
    setSelectedLevel(index);
    if (onSelect) onSelect(knowledgeLevels[index]);
  }

  return (
    <main className="tuto-screen">
      <div className="tuto-background" aria-hidden="true" />

      <div className="tuto-status" aria-label="상태 표시줄">
        <span className="tuto-time">9:41</span>
        <StatusIcons />
      </div>

      <header className="tuto-heading">
        <p className="tuto-eyebrow">시작하기 전에</p>
        <h1>본인의 금융 지식은</h1>
      </header>

      <section className="tuto-options" aria-label="금융 지식 수준 선택">
        {knowledgeLevels.map((level, index) => (
          <button
            className={`tuto-option${selectedLevel === index ? " tuto-option--selected" : ""}`}
            type="button"
            key={level.title}
            aria-pressed={selectedLevel === index}
            onClick={() => selectLevel(index)}
          >
            <span className="tuto-option-title">{level.title}</span>
            <span className="tuto-option-description">{level.description}</span>
          </button>
        ))}
      </section>

      <div className="tuto-tabbar" aria-hidden="true">
        <div className="tuto-home-indicator" />
      </div>
    </main>
  );
}
