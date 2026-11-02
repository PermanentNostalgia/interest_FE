export default function FinancialModal({ stockName, companyInfo, onClose }) {
  const { financials, per } = companyInfo;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div style={{ background: "white", padding: "16px", width: "100%" }}>
        <h3>{stockName} · 재무제표 요약</h3>
        <p>매출액 {financials.revenue}</p>
        <p>영업이익 {financials.operatingProfit}</p>
        <p>부채비율 {financials.debtRatio}</p>
        <p>PER {per}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}