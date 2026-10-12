import { useState } from "react";

import CompanyInfo from "./CompanyInfo";
import SafetyGuardBanner from "./SafetyGuardBanner";
import {
  INITIAL_QUANTITY,
  calculateProfit,
} from "../../utils/mock_invest/tradeUtils";

export default function TradeMain({ scenario, onBack, onFinish }) {
  const [view, setView] = useState("main");
  const [hasCheckedCompanyInfo, setHasCheckedCompanyInfo] = useState(false);
  //hasCheckedCompanyInfo는 제무제표 열어봤는지
  const [hasCheckedFinancials, setHasCheckedFinancials] = useState(false);
  const [pendingTrade, setPendingTrade] = useState(null);
  const [trades, setTrades] = useState([]);

  const [dayIndex, setDayIndex] = useState(0);
  const [skipDays, setSkipDays] = useState(1);
  const [quantity, setQuantity] = useState(INITIAL_QUANTITY);
  const [averagePrice, setAveragePrice] = useState(scenario.prices[0]);

  const lastIndex = scenario.prices.length - 1;
  const currentPrice = scenario.prices[dayIndex];
  const evaluationAmount = currentPrice * quantity;
  const initialValue = scenario.prices[0] * INITIAL_QUANTITY;
  const profit = calculateProfit(initialValue, evaluationAmount, trades);

  const openCompanyInfo = () => {
    setHasCheckedCompanyInfo(true);
    setPendingTrade(null);
    setView("company");
  };

  const handleSkip = () => {
    setDayIndex(Math.min(dayIndex + skipDays, lastIndex));
  };

  const executeTrade = (type) => {
    if (type === "sell" && quantity === 0) return;

    if (type === "buy") {
      const newAveragePrice = Math.round(
        (averagePrice * quantity + currentPrice) / (quantity + 1)
      );
      setAveragePrice(newAveragePrice);
      setQuantity(quantity + 1);
    } else {
      setQuantity(quantity - 1);
    }

    setTrades([
      ...trades,
      {
        dayIndex,
        type,
        price: currentPrice,
        quantity: 1,
        checkedCompanyInfo: hasCheckedCompanyInfo,
      },
    ]);
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

  const handleFinish = () => {
    onFinish({
      profit,
      rate: (profit / initialValue) * 100,
      finalDay: dayIndex + 1,
      trades,
      hasCheckedFinancials,
    });
  };

  if (view === "company") {
    return (
      <CompanyInfo
        scenario={scenario}
        onBack={() => setView("main")}
        onViewFinancials={() => setHasCheckedFinancials(true)}
      />
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
        총 손익 {profit >= 0 ? "+" : ""}
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

      <button onClick={handleFinish}>거래 마무리하고 결과 보기</button>
    </>
  );
}