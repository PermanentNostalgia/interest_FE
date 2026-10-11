import { useState } from "react";

import CompanyInfo from "./CompanyInfo";
import SafetyGuardBanner from "./SafetyGuardBanner";

const INITIAL_QUANTITY = 20;

export default function TradeMain({ scenario, onBack }) {
  const [view, setView] = useState("main");
  const [hasCheckedCompanyInfo, setHasCheckedCompanyInfo] = useState(false);
  const [pendingTrade, setPendingTrade] = useState(null);

  const [dayIndex, setDayIndex] = useState(0);
  const [skipDays, setSkipDays] = useState(1);
  const [quantity, setQuantity] = useState(INITIAL_QUANTITY);
  const [averagePrice, setAveragePrice] = useState(scenario.prices[0]);

  const lastIndex = scenario.prices.length - 1;
  const currentPrice = scenario.prices[dayIndex];
  const evaluationAmount = currentPrice * quantity;
  const profit = (currentPrice - averagePrice) * quantity;

  const openCompanyInfo = () => {
    setHasCheckedCompanyInfo(true);
    setPendingTrade(null);
    setView("company");
  };

  const handleSkip = () => {
    setDayIndex(Math.min(dayIndex + skipDays, lastIndex));
  };

  const executeTrade = (type) => {
    if (type === "buy") {
      const newAveragePrice = Math.round(
        (averagePrice * quantity + currentPrice) / (quantity + 1)
      );
      setAveragePrice(newAveragePrice);
      setQuantity(quantity + 1);
    } else {
      if (quantity === 0) return;
      setQuantity(quantity - 1);
    }
  };

  const requestTrade = (type) => {
    if (hasCheckedCompanyInfo) {
      executeTrade(type);
    } else {
      setPendingTrade(type);
    }
  };

  const handleProceed = () => {
    executeTrade(pendingTrade);
    setPendingTrade(null);
  };

  if (view === "company") {
    return (
      <CompanyInfo scenario={scenario} onBack={() => setView("main")} />
    );
  }

  return (
    <>
      <button onClick={onBack}>← 시나리오 다시 고르기</button>
      <h2>
        {scenario.stockName} · 시가 {currentPrice.toLocaleString()}원
      </h2>
      <p>{dayIndex + 1}일차</p>

      <div>
        <button onClick={() => setSkipDays(1)}>1일</button>
        <button onClick={() => setSkipDays(7)}>1주</button>
        <button onClick={handleSkip} disabled={dayIndex === lastIndex}>
          {skipDays === 1 ? "1일" : "1주"} 넘기기
        </button>
      </div>

      <h3>평가금액</h3>
      <h1>{evaluationAmount.toLocaleString()}원</h1>
      <p>
        평가손익 {profit >= 0 ? "+" : ""}
        {profit.toLocaleString()}원
      </p>

      <div>
        <button onClick={() => requestTrade("sell")}>매도</button>
        <button onClick={() => requestTrade("buy")}>매수</button>
        <button onClick={openCompanyInfo}>기업정보</button>
      </div>

      {pendingTrade && (
        <SafetyGuardBanner
          onOpenCompanyInfo={openCompanyInfo}
          onProceed={handleProceed}
        />
      )}

      <p>보유 수량 {quantity}주</p>
      <p>매입 평균가 {averagePrice.toLocaleString()}원</p>
    </>
  );
}