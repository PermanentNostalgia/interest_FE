import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import learnPageMetadata from "../assets/learn_page/learn_page_metadata.js";
import InterestSimulation from "../components/learn_page/InterestSimulation";
import MarketCapExample from "../components/learn_page/MarketCapExample";
import ValueSimulation from "../components/learn_page/ValueSimulation";
import { saveTermResult } from "../utils/records";
import "./LearnPage.css";

import { getSessionToken } from "../utils/auth.js";

const RESULT_DELAY_MS = 600; // 답을 고르고 결과 카드가 나오기까지 걸리는 시간
const DONE_DELAY_MS = 2500; // 학습 완료 화면이 머무는 시간

export default function LearnPage() {
  const { chapterName } = useParams();

  // 챕터가 바뀌면 화면 상태도 처음부터 다시 시작해요
  return <LearnContent key={chapterName} chapterName={chapterName} />;
}

function LearnContent({ chapterName }) {
  const navigate = useNavigate();
  const chapter = learnPageMetadata[chapterName];

  const [stepIndex, setStepIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hasWrongAnswer, setHasWrongAnswer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const correctAnswerCounter = useRef(0);
  const quizCounter = useRef(0);

  useEffect(() => {
    if (selectedIndex === null) return;

    const timer = setTimeout(() => setShowResult(true), RESULT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  useEffect(() => {
    if (!isDone) return;
    console.log(correctAnswerCounter.current);
    console.log(quizCounter.current);

    if(correctAnswerCounter.current==quizCounter.current/2) {
      fetch(`/api/users/me/chap1/${chapter.unit[chapter.unit.length-1]}`,{
        method: "PATCH",
        headers: {"Authorization": `Bearer ${getSessionToken()}`, "Content-Type": "application/json"},
        body: JSON.stringify({
          progress: chapter.chapter,
          isCleared: true
        })
      }).catch((error)=>{
        console.log(error);
      })
    }

    const timer = setTimeout(
      () => navigate(`/units/${chapter.unit}`),
      DONE_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [isDone, chapter, navigate]);

  if (!chapter) {
    return <h1>'{chapterName}'라는 이름의 챕터는 존재하지 않습니다.</h1>;
  }

  const totalSteps = chapter.steps.length;
  const step = chapter.steps[stepIndex];
  const isLastStep = stepIndex === chapter.steps.length - 1;
  const nextStep = chapter.steps[stepIndex + 1];

  const question = step.type === "quiz" ? step.questions[questionIndex] : null;
  const isLastQuestion =
    step.type === "quiz" && questionIndex === step.questions.length - 1;
  const isAnswered = selectedIndex !== null;
  const isCorrect = isAnswered && selectedIndex === question.answerIndex;

  const goToStep = (index) => {
    setStepIndex(index);
    setQuestionIndex(0);
    setSelectedIndex(null);
    setShowResult(false);
    setHasWrongAnswer(false);
  };

  // 용어 하나를 마치면 학습 완료 화면을 보여주고 메인으로 돌아가요
  const finishChapter = () => setIsDone(true);

  const handleBack = () => {
    if (stepIndex > 0) {
      goToStep(stepIndex - 1);
    } else {
      navigate(`/units/${chapter.unit}/terms`);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      finishChapter();
    } else {
      goToStep(stepIndex + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setQuestionIndex(questionIndex + 1);
      setSelectedIndex(null);
      setShowResult(false);
    } else {
      handleNext();
    }
  };

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedIndex(index);

    const isWrong = hasWrongAnswer || index !== question.answerIndex;
    setHasWrongAnswer(isWrong);
    if (isLastQuestion) saveTermResult(chapterName, !isWrong);
  };

  const getOptionClass = (index) => {
    let className = "learn-option";
    if (index !== selectedIndex) return className;
    return className + (index === question.answerIndex ? " correct" : " wrong");
  };

  if (isDone) {
    return (
      <div
        className="learn-page learn-done"
        onClick={() => navigate(`/units/${chapter.unit}`)}
      >
        <h1 className="learn-title">학습 완료!</h1>
        <div className="learn-progress">
          <div
            className="learn-progress-bar"
            style={{ width: "100%" }}
          />
        </div>
        <p className="learn-count">
          학습 {totalSteps}/{totalSteps}
        </p>
      </div>
    );
  }

  let guide = step.label;
  if (step.type === "quiz") guide = "답을 골라주세요";
  else if (stepIndex === 0 && chapter.subtitle) guide = chapter.subtitle;

  const nextLabel = nextStep?.type === "quiz" ? "퀴즈 풀러가기" : "다음";

  const renderContent = () => {
    if (step.type === "quiz" && showResult) {
      if(isCorrect) {
        correctAnswerCounter.current++;
      }
      return (
        <>
          <div className={"learn-result " + (isCorrect ? "correct" : "wrong")}>
            <p className="learn-result-mark">{isCorrect ? "O" : "X"}</p>
            <h2>{isCorrect ? "정답이에요!" : "아쉬워요!"}</h2>
            <p className="learn-result-text">
              {question.explanation ??
                `정답은 ${question.options[question.answerIndex]}예요`}
            </p>
          </div>
          <button className="learn-cta narrow" onClick={handleNextQuestion}>
            {!isLastQuestion ? "다음 문제로" : isLastStep ? "학습 완료" : "다음"}
          </button>
        </>
      );
    }

    if (step.type === "quiz") {
      quizCounter.current++;
      return (
        <>
          <div className="learn-card question">{question.question}</div>
          {question.options.map((option, index) => (
            <button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleSelect(index)}
            >
              {option}
            </button>
          ))}
        </>
      );
    }

    return (
      <>
        {step.type === "explain" ? (
          <>
            <div className="learn-card explain">
              {step.lines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            {step.example === "market-cap" && <MarketCapExample />}
          </>
        ) : step.simulation ? (
          <ValueSimulation type={step.simulation} />
        ) : (
          <InterestSimulation />
        )}
        <button className="learn-cta" onClick={handleNext}>
          {isLastStep ? "학습 완료" : nextLabel}
        </button>
      </>
    );
  };

  return (
    <div className="learn-page">
      <div className="learn-top">
        <button className="learn-back" onClick={handleBack} aria-label="뒤로">
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
        <span className="learn-count">
          학습 {stepIndex + 1}/{totalSteps}
        </span>
      </div>
      <div className="learn-progress">
        <div
          className="learn-progress-bar"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <h1 className="learn-title">{chapter.title}</h1>
      <p className="learn-guide">{guide}</p>

      {renderContent()}
    </div>
  );
}
