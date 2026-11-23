const won = (value) => `${value.toLocaleString()}원`;

const COMPANIES = [
  { name: "(주)WAP상사", icon: "🏢", price: 10000, shares: 1000 },
  { name: "우산 공장", icon: "☂️", price: 50000, shares: 10 },
];

// 1주 가격은 우산 공장이 비싸도, 시가총액은 WAP상사가 훨씬 크다는 걸 나란히 보여줘요
export default function MarketCapExample() {
  const marketCaps = COMPANIES.map((company) => company.price * company.shares);
  const biggest = Math.max(...marketCaps);
  const ratio = Math.round(biggest / Math.min(...marketCaps));

  return (
    <div className="learn-card example">
      <p className="example-title">한눈에 비교해 볼까요?</p>
      {COMPANIES.map((company, index) => (
        <div key={company.name} className="example-company">
          <p className="example-name">
            {company.icon} {company.name}
          </p>
          <p className="example-line">
            <span>1주 가격</span>
            <strong>{won(company.price)}</strong>
          </p>
          <p className="example-line">
            <span>발행 주식 수</span>
            <strong>{company.shares.toLocaleString()}주</strong>
          </p>
          <p className="example-line total">
            <span>시가총액</span>
            <strong>
              {won(company.price)} × {company.shares.toLocaleString()}주 ={" "}
              {won(marketCaps[index])}
            </strong>
          </p>
          <div className="example-bar">
            <div style={{ width: `${(marketCaps[index] / biggest) * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="example-result">
        1주 가격은 우산 공장이 비싸도, 진짜 회사 규모는 WAP상사가 {ratio}배나
        커요!
      </p>
    </div>
  );
}
