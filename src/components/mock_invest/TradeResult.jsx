import { Link } from "react-router";

import { BackButton } from "./MockHeader";
import { buildFeedback } from "../../utils/mock_invest/tradeUtils";

export default function TradeResult({ scenario, result, onRetry }) {
  const { profit, rate, trades, hasCheckedFinancials } = result;
  const hasFinancials = Boolean(scenario.companyInfo?.financials);
  const { goods, misses } = buildFeedback(
    trades,
    hasCheckedFinancials,
    hasFinancials
  );

  const sign = profit >= 0 ? "+" : "-";
  const tone = profit >= 0 ? "up" : "down";

  return (
    <>
      <div className="mock-top">
        <BackButton onClick={onRetry} />
        <span>{scenario.mode === "free" ? "자유 투자 모드" : "시나리오 모드"}</span>
      </div>

      <h1 className="mock-stock mock-stock--white">모의 투자 끝 !</h1>
      <p className="mock-stock-sub mock-stock-sub--white">
        {profit >= 0 ? "성공적인 첫 투자였어요" : "다음엔 더 잘할 수 있어요"}
      </p>

      <section className="mock-card mock-card--solid mock-result">
        <h2>최종 수익률</h2>
        <p className={"mock-result-rate " + tone}>
          {sign} {Math.abs(rate).toFixed(1)} %
        </p>
        <p className="mock-result-profit">
          총 손익 {sign} {Math.abs(profit).toLocaleString()}원
        </p>
      </section>

      {trades.length === 0 && (
        <section className="mock-card mock-feedback">
          <h2>거래 기록</h2>
          <p>거래 기록이 없어요.</p>
        </section>
      )}

      {trades.length > 0 && goods.length > 0 && (
        <section className="mock-card mock-feedback">
          <h2>잘한 점</h2>
          {goods.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </section>
      )}

      {trades.length > 0 && misses.length > 0 && (
        <section className="mock-card mock-feedback">
          <h2>놓친 지표</h2>
          {misses.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          <Link className="mock-relearn" to="/units/unit1">
            다시 배우기 ▸
          </Link>
        </section>
      )}

      <div className="mock-actions mock-actions--two">
        <button className="mock-btn" onClick={onRetry}>
          다시 해보기
        </button>
        <Link className="mock-btn" to="/units/unit1">
          배우러 가기
        </Link>
      </div>
    </>
  );
}
