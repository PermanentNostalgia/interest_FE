import { useState } from "react";

import scenarioMetadata from "../assets/mock_invest/scenario_metadata.js";
import ScenarioCard from "../components/mock_invest/ScenarioCard";
import TradeMain from "../components/mock_invest/TradeMain";
import TradeResult from "../components/mock_invest/TradeResult";

export default function MockInvestPage() {
  const [step, setStep] = useState("select");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [result, setResult] = useState(null);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setStep("trade");
  };

  const handleFinish = (tradeResult) => {
    setResult(tradeResult);
    setStep("result");
  };

  if (step === "trade") {
    return (
      <TradeMain
        scenario={selectedScenario}
        onBack={() => setStep("select")}
        onFinish={handleFinish}
      />
    );
  }

  if (step === "result") {
    return (
      <TradeResult
        scenario={selectedScenario}
        result={result}
        onRetry={() => setStep("select")}
      />
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