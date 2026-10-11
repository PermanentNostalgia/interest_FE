import { useState } from "react";

import scenarioMetadata from "../assets/mock_invest/scenario_metadata.js";
import ScenarioCard from "../components/mock_invest/ScenarioCard";

export default function MockInvestPage() {
  const [step, setStep] = useState("select");
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setStep("trade");
  };

  if (step === "trade") {
    return (
      <>
        <h1>{selectedScenario.stockName} · {selectedScenario.startDate}</h1>
        <p>모의투자 화면</p>
        <button onClick={() => setStep("select")}>시나리오 다시 고르기</button>
      </>
    );
  }

  return (
    <>
      <h1>어떤 종목으로 시작할까요?</h1>
      {scenarioMetadata.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          onSelect={handleSelectScenario}
        />
      ))}
    </>
  );
}