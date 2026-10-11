import { useState } from "react";

import FinancialModal from "./FinancialModal";

export default function CompanyInfo({ scenario, onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { stockCode, marketCap, roe, per, pbr } = scenario.companyInfo;

  return (
    <>
      <button onClick={onBack}>← 거래 화면으로</button>
      <h2>{scenario.stockName}</h2>
      <p>종목코드 {stockCode}</p>

      <h3>투자 지표</h3>
      <p>시가총액 {marketCap}</p>
      <p>ROE {roe}</p>

      <h3>가치평가 지표</h3>
      <p>PER {per}</p>
      <p>PBR {pbr}</p>

      <button onClick={() => setIsModalOpen(true)}>재무제표 보기</button>

      {isModalOpen && (
        <FinancialModal
          stockName={scenario.stockName}
          companyInfo={scenario.companyInfo}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}