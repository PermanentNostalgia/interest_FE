import { useEffect, useState } from "react";

import { fetchStocks } from "../../api/mockInvestApi";
import freeStockData from "../../assets/mock_invest/free_stock_data.js";
import MockHeader from "./MockHeader";

export default function FreeStockSelect({ onSelect, onBack }) {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState(null);
  const [isDummy, setIsDummy] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchStocks()
      .then((list) => {
        if (!ignore) setStocks(list);
      })
      .catch(() => {
        if (ignore) return;
        setStocks(freeStockData);
        setIsDummy(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const keyword = query.trim().toLowerCase();
  const results = (stocks ?? []).filter(
    (stock) =>
      stock.stockName.toLowerCase().includes(keyword) ||
      stock.companyInfo.stockCode.includes(keyword)
  );

  return (
    <>
      <MockHeader
        eyebrow="투자할 종목을 골라 보세요"
        title="종목 검색"
        onBack={onBack}
      />

      <input
        className="mock-search"
        type="text"
        placeholder="종목명 또는 종목코드"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {!stocks && <p className="mock-notice">종목을 불러오는 중이에요</p>}

      {isDummy && (
        <p className="mock-notice">시세를 불러오지 못해서 임의 데이터로 진행해요</p>
      )}

      {stocks && results.length === 0 && (
        <p className="mock-notice">검색 결과가 없어요</p>
      )}

      {results.map((stock) => (
        <button
          key={stock.companyInfo.stockCode}
          className="mock-list-item"
          onClick={() => onSelect(stock)}
        >
          <strong>{stock.stockName}</strong>
          <span>{stock.companyInfo.stockCode}</span>
        </button>
      ))}

      <p className="mock-notice">
        지금은 임시 시세예요. 가상 투자이며 투자 권유가 아니에요.
      </p>
    </>
  );
}
