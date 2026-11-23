import { useState } from "react";

const won = (value) => `${value.toLocaleString()}원`;
const man = (value) => `${value.toLocaleString()}만 원`;

// 슬라이더 두 개를 움직이면 지표가 바뀌고, 결과에 따라 표정과 날씨가 달라져요
const SIMULATIONS = {
  "market-cap": {
    sliders: [
      { key: "price", label: "주식 1주 가격", min: 1000, max: 100000, step: 1000, initial: 10000, format: won },
      { key: "shares", label: "발행 주식 수", min: 10, max: 1000, step: 10, initial: 100, format: (value) => `${value.toLocaleString()}주` },
    ],
    compute: ({ price, shares }) => {
      const marketCap = price * shares;
      const ratio = Math.log10(marketCap / 10000) / Math.log10(10000);
      const floors = Math.max(1, Math.round(1 + 59 * ratio));

      let icon = "🏢";
      let face = "🙂";
      let message = `${floors}층짜리 건물이에요. 슬라이더를 움직여 보세요!`;
      if (floors >= 40) {
        icon = "🏙️";
        face = "😄";
        message = `삐까뻔쩍한 ${floors}층 마천루가 됐어요!`;
      } else if (floors <= 5) {
        icon = "🏚️";
        face = "😣";
        message = `초라한 ${floors}층 단칸방으로 쪼그라들었어요...`;
      }

      return {
        icon,
        face,
        message,
        gaugeLabel: "회사 덩치",
        gaugeRatio: floors / 60,
        result: `시가총액 ${won(marketCap)} = ${won(price)} × ${shares.toLocaleString()}주`,
      };
    },
  },

  per: {
    sliders: [
      { key: "marketCap", label: "시가총액(몸값)", min: 1000, max: 50000, step: 1000, initial: 10000, format: won },
      { key: "profit", label: "1년 순이익", min: 100, max: 5000, step: 100, initial: 1000, format: won },
    ],
    compute: ({ marketCap, profit }) => {
      const per = marketCap / profit;

      let icon = "⛅";
      let face = "🙂";
      let message = "보통 수준이에요. 슬라이더를 움직여 보세요!";
      if (per >= 30) {
        icon = "🌧️";
        face = "😰";
        message = "거품이야! 번 돈에 비해 너무 비싸요";
      } else if (per < 10) {
        icon = "☀️";
        face = "😄";
        message = "가성비 최고! 번 돈에 비해 주가가 싸요";
      }

      return {
        icon,
        face,
        message,
        gaugeLabel: "PER",
        gaugeRatio: Math.min(per / 50, 1),
        gaugeAlert: per >= 30,
        result: `PER ${per.toFixed(1)}배 = ${won(marketCap)} ÷ ${won(profit)}`,
      };
    },
  },

  pbr: {
    sliders: [
      { key: "assets", label: "순자산(회사 재산)", min: 1000, max: 50000, step: 1000, initial: 10000, format: won },
      { key: "marketCap", label: "시가총액(현재 몸값)", min: 1000, max: 100000, step: 1000, initial: 10000, format: won },
    ],
    compute: ({ assets, marketCap }) => {
      const pbr = marketCap / assets;

      let icon = "⛅";
      let face = "🙂";
      let message = "재산과 몸값이 비슷해요. 슬라이더를 움직여 보세요!";
      if (pbr >= 5) {
        icon = "🌧️";
        face = "😰";
        message = "가진 재산에 비해 너무 비싸!";
      } else if (pbr < 1) {
        icon = "☀️";
        face = "🎁";
        message = `${won(assets)}짜리를 ${won(marketCap)}에 사는 바겐세일!`;
      }

      return {
        icon,
        face,
        message,
        gaugeLabel: "PBR",
        gaugeRatio: Math.min(pbr / 10, 1),
        gaugeAlert: pbr >= 5,
        result: `PBR ${pbr.toFixed(1)}배 = ${won(marketCap)} ÷ ${won(assets)}`,
      };
    },
  },

  roe: {
    sliders: [
      { key: "equity", label: "밑천(자기자본)", min: 1000, max: 50000, step: 1000, initial: 10000, format: won },
      { key: "profit", label: "1년 순이익", min: 0, max: 15000, step: 100, initial: 1000, format: won },
    ],
    compute: ({ equity, profit }) => {
      const roe = (profit / equity) * 100;

      let icon = "⛅";
      let face = "🙂";
      let message = "보통 수준이에요. 슬라이더를 움직여 보세요!";
      if (roe < 1) {
        icon = "🌧️";
        face = "😰";
        message = "은행 이자보다 못 벌다니...";
      } else if (roe >= 20) {
        icon = "☀️";
        face = "🤑";
        message = "돈 굴리는 실력 최고!";
      }

      return {
        icon,
        face,
        message,
        gaugeLabel: "ROE",
        gaugeRatio: Math.min(roe / 40, 1),
        gaugeAlert: roe < 1,
        result: `ROE ${roe.toFixed(1)}% = ${won(profit)} ÷ ${won(equity)}`,
      };
    },
  },

  eps: {
    sliders: [
      { key: "profit", label: "1년 순이익", min: 100000, max: 3000000, step: 100000, initial: 1000000, format: won },
      { key: "shares", label: "발행 주식 수", min: 500, max: 4000, step: 100, initial: 1000, format: (value) => `${value.toLocaleString()}주` },
    ],
    compute: ({ profit, shares }) => {
      const stockPrice = 10000;
      const eps = Math.round(profit / shares);
      const per = stockPrice / eps;

      let icon = "⛅";
      let face = "🙂";
      let message = "주식 1주의 몫이에요. 슬라이더를 움직여 보세요!";
      if (eps >= 1500) {
        icon = "☀️";
        face = "😄";
        message = "주식 1주가 든든해!";
      } else if (eps <= 500) {
        icon = "🌧️";
        face = "😓";
        message = "내 몫이 줄었어...";
      }

      return {
        icon,
        face,
        message,
        stack: { emoji: "🪙", count: Math.min(Math.round(eps / 200), 20), label: "주식 1주 위의 동전" },
        gaugeLabel: "EPS",
        gaugeRatio: Math.min(eps / 3000, 1),
        gaugeAlert: eps <= 500,
        result: `EPS ${won(eps)} = ${won(profit)} ÷ ${shares.toLocaleString()}주`,
        extra: `현재 주가 ${won(stockPrice)} ÷ EPS ${won(eps)} = PER ${per.toFixed(1)}배`,
      };
    },
  },

  "operating-profit": {
    sliders: [
      { key: "sales", label: "매출액", min: 0, max: 2000, step: 50, initial: 1000, format: man },
      { key: "cost", label: "영업 비용", min: 0, max: 2000, step: 50, initial: 950, format: man },
    ],
    compute: ({ sales, cost }) => {
      const profit = sales - cost;

      let icon = "⛅";
      let face = "🙂";
      let message = "본업으로 조금 남겼어요. 슬라이더를 움직여 보세요!";
      if (profit < 0) {
        icon = "🌧️";
        face = "😰";
        message = "적자예요! 저금통이 텅 비었어요...";
      } else if (profit >= 200) {
        icon = "☀️";
        face = "😄";
        message = "본업이 아주 탄탄해!";
      }

      return {
        icon,
        face,
        message,
        stack: { emoji: "🪙", count: Math.min(Math.max(Math.round(profit / 25), 0), 20), label: "저금통" },
        gaugeLabel: "영업이익",
        gaugeRatio: Math.min(Math.max(profit, 0) / 600, 1),
        gaugeAlert: profit < 0,
        result: `영업이익 ${man(profit)} = ${man(sales)} - ${man(cost)}`,
        extra: "기업정보 화면의 재무제표에서도 매출액과 영업이익을 볼 수 있어요.",
      };
    },
  },

  bond: {
    sliders: [
      { key: "rate", label: "새로 나오는 채권 금리", min: 1, max: 15, step: 1, initial: 5, format: (value) => `${value}%` },
    ],
    choices: [
      { key: "government", label: "국채", yieldRate: 3, risk: "위험 낮음 🛡️" },
      { key: "corporate", label: "회사채", yieldRate: 7, risk: "위험 높음 ⚠️" },
    ],
    compute: ({ rate }, choice) => {
      const price = Math.round(10500 / (1 + rate / 100));

      let icon = "⛅";
      let face = "🙂";
      let message = "기존 채권(이자 5%)의 가격이에요. 금리를 움직여 보세요!";
      if (rate > 5) {
        icon = "🌧️";
        face = "😢";
        message = "내 채권이 싸졌어...";
      } else if (rate < 5) {
        icon = "☀️";
        face = "😄";
        message = "비싸게 팔 수 있어!";
      }

      return {
        icon,
        face,
        message,
        seesaw: { newRate: rate, oldRate: 5 },
        gaugeLabel: "기존 채권 가격",
        gaugeRatio: Math.min(Math.max(price / 12000, 0), 1),
        gaugeAlert: rate > 5,
        result: `새 채권 이자 ${rate}% · 내 채권(이자 5%) 가격 ${won(price)} (액면가 ${won(10000)})`,
        extra: `${choice.label}: 이자(수익률) 약 ${choice.yieldRate}% · ${choice.risk}`,
      };
    },
  },

  "debt-ratio": {
    sliders: [
      { key: "debt", label: "부채(빚)", min: 0, max: 30000, step: 1000, initial: 5000, format: won },
      { key: "rate", label: "금리", min: 1, max: 15, step: 1, initial: 5, format: (value) => `${value}%` },
    ],
    compute: ({ debt, rate }) => {
      const equity = 10000;
      const ratio = (debt / equity) * 100;
      const interest = Math.round((debt * rate) / 100);
      const burden = interest / 3000;

      let icon = "⛅";
      let face = "🙂";
      let message = "자기자본 10,000원은 그대로예요. 슬라이더를 움직여 보세요!";
      if (ratio >= 200 && rate >= 7) {
        icon = "🌧️";
        face = "😫";
        message = "이자 갚다 허리가 휘어요!";
      } else if (ratio <= 100) {
        icon = "☀️";
        face = "😄";
        message = "빚 걱정 없이 든든해!";
      }

      return {
        icon,
        face,
        message,
        gaugeLabel: `이자 지출 ${won(interest)}`,
        gaugeRatio: Math.min(burden, 1),
        gaugeAlert: ratio >= 200 && rate >= 7,
        result: `부채비율 ${ratio.toFixed(0)}% = ${won(debt)} ÷ ${won(equity)} × 100`,
        extra: "기업정보 화면에서 부채비율을 확인할 때도 똑같이 읽어요.",
      };
    },
  },

  revenue: {
    sliders: [
      { key: "price", label: "판매 가격", min: 1000, max: 30000, step: 1000, initial: 10000, format: won },
      { key: "quantity", label: "판매량", min: 0, max: 2000, step: 100, initial: 1000, format: (value) => `${value.toLocaleString()}개` },
    ],
    compute: ({ price, quantity }) => {
      const revenue = price * quantity;

      let icon = "⛅";
      let face = "🙂";
      let message = "우산 가게 매출이에요. 슬라이더를 움직여 보세요!";
      if (revenue >= 12000000) {
        icon = "☀️";
        face = "😄";
        message = "우산이 불티나게 팔려요!";
      } else if (revenue <= 3000000) {
        icon = "🌧️";
        face = "😞";
        message = "금고가 텅 비었어요...";
      }

      return {
        icon,
        face,
        message,
        stack: { emoji: "💵", count: Math.min(Math.round(revenue / 2000000), 20), label: "금고 속 돈다발" },
        gaugeLabel: "매출액",
        gaugeRatio: Math.min(revenue / 30000000, 1),
        gaugeAlert: revenue <= 3000000,
        result: `매출액 ${won(revenue)} = ${won(price)} × ${quantity.toLocaleString()}개`,
        footer: "매출액이 높아도 남은 돈은 다를 수 있어요. 다음 단계에서 확인해 봐요!",
      };
    },
  },
};

export default function ValueSimulation({ type }) {
  const { sliders, choices, compute } = SIMULATIONS[type];
  const [values, setValues] = useState(() =>
    Object.fromEntries(sliders.map((slider) => [slider.key, slider.initial]))
  );
  const [choiceKey, setChoiceKey] = useState(choices?.[0].key);

  const choice = choices?.find((item) => item.key === choiceKey);
  const view = compute(values, choice);

  return (
    <div className="learn-card large simulation">
      <div className="sim-weather">{view.icon}</div>
      <div className="sim-face">{view.face} WAP상사</div>
      <p>{view.message}</p>

      {view.seesaw && (
        <div className="sim-seesaw">
          <span>새 채권 {view.seesaw.newRate}%</span>
          <span
            className="sim-seesaw-bar"
            style={{
              transform: `rotate(${Math.max(-12, Math.min(12, (view.seesaw.oldRate - view.seesaw.newRate) * 2))}deg)`,
            }}
          />
          <span>내 채권 {view.seesaw.oldRate}%</span>
        </div>
      )}

      {view.stack && (
        <div className="sim-stack" aria-label={view.stack.label}>
          {view.stack.count === 0 ? (
            <span className="sim-stack-empty">텅 비었어요</span>
          ) : (
            Array.from({ length: view.stack.count }, (_, index) => (
              <span key={index}>{view.stack.emoji}</span>
            ))
          )}
        </div>
      )}

      {sliders.map((slider) => (
        <div key={slider.key} className="sim-control">
          <p>
            {slider.label} {slider.format(values[slider.key])}
          </p>
          <input
            className="sim-slider"
            type="range"
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={values[slider.key]}
            onChange={(event) =>
              setValues({ ...values, [slider.key]: Number(event.target.value) })
            }
          />
        </div>
      ))}

      {choices && (
        <div className="sim-choices">
          {choices.map((item) => (
            <button
              key={item.key}
              type="button"
              className={"sim-choice" + (item.key === choiceKey ? " selected" : "")}
              onClick={() => setChoiceKey(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <p>{view.gaugeLabel}</p>
      <div className="sim-gauge">
        <div
          className={"sim-gauge-bar" + (view.gaugeAlert ? " alert" : "")}
          style={{ width: `${view.gaugeRatio * 100}%` }}
        />
      </div>
      <p>{view.result}</p>
      {view.extra && <p>{view.extra}</p>}
      {view.footer && <p className="sim-footer">{view.footer}</p>}
    </div>
  );
}
