import { Link } from "react-router";

import { buildFeedback } from "../../utils/mock_invest/tradeUtils";

export default function TradeResult({ scenario, result, onRetry }) {
  const { profit, rate, finalDay, trades, hasCheckedFinancials } = result;
  const { goods, misses } = buildFeedback(trades, hasCheckedFinancials);

  const sign = profit >= 0 ? "+" : "";

  return (
    <>
      <p>
        {scenario.stockName} · {finalDay}일차 / 거래 결과
      </p>
      <h1>
        {sign}
        {profit.toLocaleString()}원 ({sign}
        {rate.toFixed(1)}%)
      </h1>

      <h3>거래 리포트 피드백</h3>
      {trades.length === 0 ? (
        <p>거래 기록이 없어요.</p>
      ) : (
        <>
          {goods.map((text, index) => (
            <p key={"good" + index}>👍 잘한 점: {text}</p>
          ))}
          {misses.map((text, index) => (
            <p key={"miss" + index}>👀 놓친 지표: {text}</p>
          ))}
        </>
      )}

      <button onClick={onRetry}>다시 해보기</button>
      <Link to="/units/unit1">A Part 리마인드</Link> 
      // 추후에 리마인드 설정을 개별로 해야되는데 이거는 추후 설정해야
    </>
  );
}