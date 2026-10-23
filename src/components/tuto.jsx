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

export default function Tuto({ onSelect }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  function selectLevel(index) {
    setSelectedLevel(index);
    if (onSelect) onSelect(knowledgeLevels[index]);
  }

  return (
    <main className="tuto-screen">
      <div className="tuto-background" aria-hidden="true" />

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
