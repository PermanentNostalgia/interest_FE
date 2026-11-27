import { useState } from "react";

import { saveSimulationResult } from "../api/mockInvestApi";
import scenarioMetadata from "../assets/mock_invest/scenario_metadata.js";
import BottomTab from "../components/common/BottomTab";
import FreeSetup from "../components/mock_invest/FreeSetup";
import FreeStockSelect from "../components/mock_invest/FreeStockSelect";
import MockHeader from "../components/mock_invest/MockHeader";
import ScenarioCard from "../components/mock_invest/ScenarioCard";
import ScenarioIntro from "../components/mock_invest/ScenarioIntro";
import TradeMain from "../components/mock_invest/TradeMain";
import TradeResult from "../components/mock_invest/TradeResult";
import { getSessionToken } from "../utils/auth";
import { makeFreePayload, saveMockResult } from "../utils/records";
import "./MockInvestPage.css";

export default function MockInvestPage() {
  const [step, setStep] = useState("mode");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [freeSetup, setFreeSetup] = useState(null);
  const [result, setResult] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);

  // 시나리오 모드: 기존 임시 데이터(scenario_metadata.js) 사용
  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setStep("intro");
  };

  // 자유 투자 모드: 정한 조건 + 고른 종목으로 거래 화면에 넘길 데이터를 만들어요
  const handleSelectStock = (stock) => {
    // 시세가 선택한 기간보다 짧으면 있는 만큼만 사용
    const startIndex = Math.max(0, stock.prices.length - freeSetup.offset);
    const endIndex = startIndex + freeSetup.days;
    const prices = stock.prices.slice(startIndex, endIndex);
    // 날짜는 임의 데이터에만 있음
    const dates = stock.dates?.slice(startIndex, endIndex);

    setSelectedScenario({
      id: `free-${stock.companyInfo.stockCode}`,
      mode: "free",
      stockName: stock.stockName,
      startCash: freeSetup.cash,
      dates,
      prices,
      companyInfo: stock.companyInfo,
    });
    setStep("trade");
  };

  const handleFinish = (tradeResult) => {
    const playedAt = Date.now();
    saveMockResult(selectedScenario, tradeResult, playedAt);
    setResult(tradeResult);
    setSaveFailed(false);
    setStep("result");

    // 서버 저장은 로그인 상태의 자유 투자만
    if (selectedScenario.mode === "free" && getSessionToken()) {
      const payload = makeFreePayload(selectedScenario, tradeResult, playedAt);
      saveSimulationResult(payload).catch(() => setSaveFailed(true));
    }
  };

  const handleBackFromTrade = () => {
    setStep(selectedScenario.mode === "free" ? "free-stock" : "intro");
  };

  let content;

  if (step === "trade") {
    content = (
      <TradeMain
        scenario={selectedScenario}
        onBack={handleBackFromTrade}
        onFinish={handleFinish}
      />
    );
  } else if (step === "result") {
    content = (
      <>
        <TradeResult
          scenario={selectedScenario}
          result={result}
          onRetry={() => setStep("mode")}
        />
        {saveFailed && (
          <p className="mock-notice">
            서버에 저장하지 못해서 이 브라우저에만 기록했어요
          </p>
        )}
      </>
    );
  } else if (step === "select") {
    content = (
      <>
        <MockHeader
          eyebrow="배운 용어를 정해진 상황에서 써봐요"
          title="시나리오 모드"
          onBack={() => setStep("mode")}
        />
        {scenarioMetadata
          .filter((scenario) => scenario.title)
          .map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              index={index}
              onSelect={handleSelectScenario}
            />
          ))}
      </>
    );
  } else if (step === "intro") {
    content = (
      <ScenarioIntro
        scenario={selectedScenario}
        index={scenarioMetadata.indexOf(selectedScenario)}
        onStart={() => setStep("trade")}
        onBack={() => setStep("select")}
      />
    );
  } else if (step === "free-setup") {
    content = (
      <FreeSetup
        onNext={(setup) => {
          setFreeSetup(setup);
          setStep("free-stock");
        }}
        onBack={() => setStep("mode")}
      />
    );
  } else if (step === "free-stock") {
    content = (
      <FreeStockSelect
        onSelect={handleSelectStock}
        onBack={() => setStep("free-setup")}
      />
    );
  } else {
    content = (
      <>
        <header className="mock-mode-head">
          <p>배운 내용으로 투자 해보기</p>
          <h1>어떻게 연습해 볼까요?</h1>
        </header>

        <button className="mock-mode-card" onClick={() => setStep("select")}>
          <strong>시나리오 모드</strong>
          <span>정해진 상황 속에서 배운 내용을 복습해보아요</span>
        </button>
        <button
          className="mock-mode-card"
          onClick={() => setStep("free-setup")}
        >
          <strong>자유 투자 모드</strong>
          <span>실제 종목을 골라 과거 시세로 투자해보아요</span>
        </button>
      </>
    );
  }

  return (
    <div className="mock-page">
      {content}
      <BottomTab />
    </div>
  );
}