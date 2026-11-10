import { useState } from "react";

const LOAN = 10000;
const BASE_RATE = 5;
const MAX_RATE = 10;

export default function InterestSimulation() {
  const [rate, setRate] = useState(BASE_RATE);

  const interest = (LOAN * rate) / 100;
  const isHigh = rate > BASE_RATE;
  const isLow = rate < BASE_RATE;

  let weather = "⛅";
  let face = "🙂";
  let message = "기준 금리예요. 슬라이더를 움직여 보세요!";

  if (isHigh) {
    weather = "🌧️";
    face = "😣";
    message = "이자 부담이 커져서 투자를 줄이고 있어요";
  } else if (isLow) {
    weather = "☀️";
    face = "😄";
    message = "이자 부담이 줄어 투자를 늘리고 있어요";
  }

  return (
    <div className="learn-card large simulation">
      <div className="sim-weather">{weather}</div>
      <div className="sim-face">{face} WAP상사</div>
      <p>{message}</p>

      <p>금리 {rate}%</p>
      <input
        className="sim-slider"
        type="range"
        min="0"
        max={MAX_RATE}
        step="1"
        value={rate}
        onChange={(event) => setRate(Number(event.target.value))}
      />

      <p>이자 지출</p>
      <div className="sim-gauge">
        <div
          className="sim-gauge-bar"
          style={{ width: `${(rate / MAX_RATE) * 100}%` }}
        />
      </div>
      <p>
        이자 {interest.toLocaleString()}원 · 1년 뒤 갚을 돈{" "}
        {(LOAN + interest).toLocaleString()}원
      </p>
    </div>
  );
}