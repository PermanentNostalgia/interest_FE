import { useState } from "react";

const won = (value) => `${value.toLocaleString()}원`;

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
};

export default function ValueSimulation({ type }) {
  const { sliders, compute } = SIMULATIONS[type];
  const [values, setValues] = useState(() =>
    Object.fromEntries(sliders.map((slider) => [slider.key, slider.initial]))
  );

  const view = compute(values);

  return (
    <div className="learn-card large simulation">
      <div className="sim-weather">{view.icon}</div>
      <div className="sim-face">{view.face} WAP상사</div>
      <p>{view.message}</p>

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

      <p>{view.gaugeLabel}</p>
      <div className="sim-gauge">
        <div
          className={"sim-gauge-bar" + (view.gaugeAlert ? " alert" : "")}
          style={{ width: `${view.gaugeRatio * 100}%` }}
        />
      </div>
      <p>{view.result}</p>
    </div>
  );
}
