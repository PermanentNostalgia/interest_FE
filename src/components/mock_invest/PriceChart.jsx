const WIDTH = 300;
const HEIGHT = 100;
const PADDING = 8;

export default function PriceChart({ prices, dayIndex }) {
  const visiblePrices = prices.slice(0, dayIndex + 1);

  const min = Math.min(...visiblePrices);
  const max = Math.max(...visiblePrices);
  const range = max - min || 1;
  const lastIndex = prices.length - 1;

  const points = visiblePrices.map((price, index) => {
    const x = PADDING + (index / lastIndex) * (WIDTH - PADDING * 2);
    const y = PADDING + (1 - (price - min) / range) * (HEIGHT - PADDING * 2);
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
        stroke="#3b8a6a"
        strokeWidth="2"
      />
      <circle cx={lastX} cy={lastY} r="4" fill="#3b8a6a" />
    </svg>
  );
}