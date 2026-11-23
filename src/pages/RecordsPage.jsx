import { useState } from "react";
import { Link } from "react-router";

import scenarioMetadata from "../assets/mock_invest/scenario_metadata.js";
import unitPageMetadata from "../assets/unit_page/unit_card_metadata.js";
import BottomTab from "../components/common/BottomTab";
import { getRecords, resetScenarioRecords, resetTermRecords } from "../utils/records";
import "./RecordsPage.css";

const TABS = ["유닛", "시나리오", "자유투자"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        d="M4 12.5l5 5L20 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatRate(rate) {
  const sign = rate >= 0 ? "+" : "-";
  return `${sign} ${Math.abs(rate).toFixed(1)}%`;
}

function tradeSummary(trade) {
  const parts = [];
  if (trade.bought > 0) parts.push(`${trade.bought}주 • 매수`);
  if (trade.sold > 0) parts.push(`${trade.sold}주 • 매도`);
  return parts.length > 0 ? parts.join(", ") : "거래 없음";
}

function UnitList({ units, records }) {
  if (units.length === 0) {
    return <p className="rec-empty">아직 배운 유닛이 없어요</p>;
  }

  return units.map(([unitKey, unit]) => {
    const reviewCount = unit.chapters.filter(
      (chapter) => !records.terms[chapter.segment]?.correct
    ).length;

    return (
      <section key={unitKey} className="rec-section">
        <h2>
          <strong>{unit.title}</strong> 다시 볼 용어 {reviewCount}개
        </h2>
        {unit.chapters.map((chapter) => {
          const isCorrect = records.terms[chapter.segment]?.correct;

          return (
            <div key={chapter.segment} className="rec-row">
              <span className="rec-name">{chapter.name}</span>
              {isCorrect ? (
                <span className="rec-badge correct">정답</span>
              ) : (
                <Link
                  className="rec-badge review"
                  to={`/learn/${chapter.segment}`}
                >
                  다시 보기
                </Link>
              )}
            </div>
          );
        })}
      </section>
    );
  });
}

function ScenarioList({ records }) {
  const done = scenarioMetadata
    .map((scenario, index) => ({ scenario, index }))
    .filter(({ scenario }) => records.scenarios[scenario.id]);

  if (done.length === 0) {
    return <p className="rec-empty">아직 끝낸 시나리오가 없어요</p>;
  }

  return done.map(({ scenario, index }) => (
    <section key={scenario.id} className="rec-section">
      <h2>시나리오 {index + 1}</h2>
      <div className="rec-row rec-row--tall">
        <div>
          <p className="rec-name">{scenario.title ?? scenario.stockName}</p>
          {scenario.topic && <p className="rec-sub">{scenario.topic}</p>}
        </div>
        <span className="rec-check">
          <CheckIcon />
        </span>
      </div>
    </section>
  ));
}

function FreeTradeList({ records }) {
  if (records.freeTrades.length === 0) {
    return <p className="rec-empty">아직 자유 투자 기록이 없어요</p>;
  }

  return (
    <section className="rec-section">
      <h2>최근 거래</h2>
      {records.freeTrades.map((trade) => (
        <div key={trade.date} className="rec-row rec-row--tall">
          <div>
            <p className="rec-name">{trade.stockName}</p>
            <p className="rec-sub">{tradeSummary(trade)}</p>
          </div>
          <span
            className={
              "rec-badge rec-badge--wide " + (trade.rate >= 0 ? "up" : "down")
            }
          >
            {formatRate(trade.rate)}
          </span>
        </div>
      ))}
    </section>
  );
}

export default function RecordsPage() {
  const [tab, setTab] = useState(0);
  const [records, setRecords] = useState(getRecords);

  const handleReset = (message, reset) => {
    if (!window.confirm(message)) return;
    reset();
    setRecords(getRecords());
  };

  const units = Object.entries(unitPageMetadata).filter(
    ([, unit]) => unit.chapters.length > 0
  );
  const startedUnits = units.filter(([, unit]) =>
    unit.chapters.some((chapter) => records.terms[chapter.segment])
  ).length;
  const doneScenarios = Object.keys(records.scenarios).length;

  const summary = [
    { label: "유닛", count: startedUnits },
    { label: "시나리오", count: doneScenarios },
    { label: "자유투자", count: records.freeTrades.length },
  ];

  return (
    <div className="rec-page">
      <header className="rec-header">
        <p>내 기록</p>
        <h1>지금까지 이만큼 배웠어요</h1>
      </header>

      <section className="rec-summary">
        {summary.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </section>

      <div className="rec-tabs">
        {TABS.map((label, index) => (
          <button
            key={label}
            className={tab === index ? "active" : ""}
            onClick={() => setTab(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="rec-progress">
        {TABS.map((label, index) => (
          <span key={label} className={tab === index ? "active" : ""} />
        ))}
      </div>

      {tab === 0 && (
        <>
          <UnitList units={units} records={records} />
          <button
            className="rec-reset"
            onClick={() =>
              handleReset("유닛 학습 기록을 모두 지울까요?", resetTermRecords)
            }
          >
            초기화
          </button>
        </>
      )}
      {tab === 1 && (
        <>
          <ScenarioList records={records} />
          <button
            className="rec-reset"
            onClick={() =>
              handleReset("시나리오 기록을 모두 지울까요?", resetScenarioRecords)
            }
          >
            초기화
          </button>
        </>
      )}
      {tab === 2 && <FreeTradeList records={records} />}

      <BottomTab />
    </div>
  );
}
