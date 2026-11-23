const WIDTH = 300;
const HEIGHT = 150;
const PADDING = 8;

export default function PriceChart({ prices, dayIndex, step = 1 }) {
  const lastIndex = prices.length - 1;

  const indexes = [];
  for (let index = 0; index < dayIndex; index += step) {
    indexes.push(index);
  }
  indexes.push(dayIndex);

  const visiblePrices = indexes.map((index) => prices[index]);
  const min = Math.min(...visiblePrices);
  const max = Math.max(...visiblePrices);
  const range = max - min || 1;

  const points = indexes.map((index) => {
    const x = PADDING + (index / lastIndex) * (WIDTH - PADDING * 2);
    const y =
      PADDING + (1 - (prices[index] - min) / range) * (HEIGHT - PADDING * 2);
    return [x, y];
  });

  const linePoints = points.map(([x, y]) => `${x},${y}`).join(" ");
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
      role="img"
      aria-label="주가 차트"
    >
      <polyline
        points={linePoints}
        fill="none"
        stroke="#ff0000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="3.5" fill="#ff0000" />
    </svg>
  );
}
