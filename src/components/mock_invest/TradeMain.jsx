import { useState } from "react";

const INITIAL_QUANTITY = 20;

export default function TradeMain({ scenario, onBack }) {
  const [dayIndex, setDayIndex] = useState(0);
  const [skipDays, setSkipDays] = useState(1);
  const [quantity, setQuantity] = useState(INITIAL_QUANTITY);
  const [averagePrice, setAveragePrice] = useState(scenario.prices[0]);

  const lastIndex = scenario.prices.length - 1;
  const currentPrice = scenario.prices[dayIndex];
  const evaluationAmount = currentPrice * quantity;
  const profit = (currentPrice - averagePrice) * quantity;

  const handleSkip = () => {
    setDayIndex(Math.min(dayIndex + skipDays, lastIndex));
  };

  const handleBuy = () => {
    const newAveragePrice = Math.round(
      (averagePrice * quantity + currentPrice) / (quantity + 1)
    );
    setAveragePrice(newAveragePrice);
    setQuantity(quantity + 1);
  };

  const handleSell = () => {
    if (quantity === 0) return;
    setQuantity(quantity - 1);
  };

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
        <button onClick={handleSell}>매도</button>
        <button onClick={handleBuy}>매수</button>
        <button>기업정보</button>
      </div>

      <p>보유 수량 {quantity}주</p>
      <p>매입 평균가 {averagePrice.toLocaleString()}원</p>
    </>
  );
}