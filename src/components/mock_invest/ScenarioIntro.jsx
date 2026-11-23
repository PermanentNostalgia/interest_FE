import MockHeader from "./MockHeader";
import { INITIAL_QUANTITY } from "../../utils/mock_invest/tradeUtils";

export default function ScenarioIntro({ scenario, index, onStart, onBack }) {
  const situation = scenario.situation ?? [scenario.description];
  const startCash = scenario.prices[0] * INITIAL_QUANTITY;

  return (
    <>
      <MockHeader
        eyebrow={`시나리오 ${index + 1}`}
        title={scenario.title}
        onBack={onBack}
      />

      <section className="mock-card mock-situation">
        <h2>오늘의 상황</h2>
        {situation.map((line, lineIndex) => (
          <p key={lineIndex}>{line}</p>
        ))}
      </section>

      <section className="mock-card mock-fields">
        <div className="mock-field">
          <span>연습 자금</span>
          <strong>{startCash.toLocaleString()}원</strong>
        </div>
        <div className="mock-field">
          <span>진행 기간</span>
          <strong>가상 {scenario.prices.length}일</strong>
        </div>
        <div className="mock-field">
          <span>선택</span>
          <strong>매수 • 매도 • 관망</strong>
        </div>
      </section>

      <button className="mock-cta" onClick={onStart}>
        가상 자금으로 시작하기
      </button>
    </>
  );
}
