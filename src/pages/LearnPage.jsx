import { useState } from "react";
import { Link, useParams } from "react-router";

import learnPageMetadata from "../assets/learn_page/learn_page_metadata.js";
import BottomTab from "../components/learn_page/BottomTab";
import "./LearnPage.css";

export default function LearnPage() {
  const { chapterName } = useParams();
  const chapter = learnPageMetadata[chapterName];

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState("question");
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!chapter) {
    return <h1>'{chapterName}'라는 이름의 챕터는 존재하지 않습니다.</h1>;
  }

  const step = chapter.steps[stepIndex];
  const totalSteps = chapter.steps.length;
  const isAnswered = selectedIndex !== null;
  const isLastStep = stepIndex === totalSteps - 1;

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedIndex(index);
  };

  const handleNext = () => {
    setStepIndex(stepIndex + 1);
    setSelectedIndex(null);
    setPhase("question");
  };

  const getOptionClass = (index) => {
    let className = "learn-option";
    if (!isAnswered) return className;
    if (index === step.answerIndex) className += " correct";
    else if (index === selectedIndex) className += " wrong";
    return className;
  };

  return (
    <div className="learn-page">
      <div className="learn-progress">
        <div
          className="learn-progress-bar"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <p className="learn-count">
        학습 {stepIndex + 1}/{totalSteps}
      </p>
      <h1 className="learn-title">{chapter.title}</h1>

      {phase === "question" ? (
        <>
          <p className="learn-guide">답을 골라주세요</p>
          <div className={"learn-card" + (isAnswered ? " dimmed" : "")}>
            {step.question}
          </div>

          {step.options.map((option, index) => (
            <button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleSelect(index)}
            >
              {option}
            </button>
          ))}

          <div className="learn-action">
            {isAnswered && (
              <button onClick={() => setPhase("explain")}>해설 보기</button>
            )}
          </div>

          <BottomTab active="배우기" />
        </>
      ) : (
        <>
          <div className="learn-card large">
            {step.explanation.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          <div className="learn-action">
            {isLastStep ? (
              <Link to={`/units/${chapter.unit}`}>학습 완료</Link>
            ) : (
              <button onClick={handleNext}>다음 문제</button>
            )}
          </div>

          <button className="learn-back" onClick={() => setPhase("question")}>
            ‹
          </button>
        </>
      )}
    </div>
  );
}