export default function ScenarioCard({ scenario, onSelect }) {
  return (
    <button onClick={() => onSelect(scenario)}>
      <div>
        {scenario.stockName} · {scenario.startDate}
      </div>
      <div>{scenario.description}</div>
    </button>
  );
}