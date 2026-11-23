import { useState } from "react";

import MockHeader from "./MockHeader";

const CASH_STEP = 100000;
const MIN_CASH = 100000;
const MAX_CASH = 10000000;
const DAYS_STEP = 5;
const MIN_DAYS = 5;

const PERIODS = [
  { label: "약 1개월 전부터", offset: 20 },
  { label: "약 3개월 전부터", offset: 60 },
  { label: "약 6개월 전부터", offset: 120 },
];

function Spinner({ onUp, onDown }) {
  return (
    <span className="mock-spinner">
      <button type="button" onClick={onUp} aria-label="늘리기">
        <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
          <path d="M5 0l5 6H0z" fill="currentColor" />
        </svg>
      </button>
      <button type="button" onClick={onDown} aria-label="줄이기">
        <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
          <path d="M5 6L0 0h10z" fill="currentColor" />
        </svg>
      </button>
    </span>
  );
}

export default function FreeSetup({ onNext, onBack }) {
  const [cash, setCash] = useState(1000000);
  const [days, setDays] = useState(20);
  const [offset, setOffset] = useState(60);

  const changeCash = (amount) =>
    setCash(Math.min(MAX_CASH, Math.max(MIN_CASH, cash + amount)));
  const changeDays = (amount) =>
    setDays(Math.min(offset, Math.max(MIN_DAYS, days + amount)));

  const changeOffset = (event) => {
    const value = Number(event.target.value);
    setOffset(value);
    setDays(Math.min(days, value));
  };

  return (
    <>
      <MockHeader
        eyebrow="내 속도로 투자해 보기"
        title="자유 투자 모드"
        onBack={onBack}
      />

      <section className="mock-card mock-fields">
        <h2>연습 조건</h2>
        <div className="mock-field">
          <span>시작 자금</span>
          <strong>{cash.toLocaleString()}원</strong>
          <Spinner
            onUp={() => changeCash(CASH_STEP)}
            onDown={() => changeCash(-CASH_STEP)}
          />
        </div>
        <div className="mock-field">
          <span>기간</span>
          <strong>{days} 거래일</strong>
          <Spinner
            onUp={() => changeDays(DAYS_STEP)}
            onDown={() => changeDays(-DAYS_STEP)}
          />
        </div>
      </section>

      <section className="mock-card mock-fields">
        <h2>투자할 시장과 기간</h2>
        <div className="mock-field">
          <span>시장</span>
          <strong>국내 주식</strong>
        </div>
        <label className="mock-field">
          <span>과거 기간</span>
          <select value={offset} onChange={changeOffset}>
            {PERIODS.map((period) => (
              <option key={period.offset} value={period.offset}>
                {period.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <button
        className="mock-cta"
        onClick={() => onNext({ cash, days, offset })}
      >
        이 조건으로 투자 시작
      </button>
    </>
  );
}
