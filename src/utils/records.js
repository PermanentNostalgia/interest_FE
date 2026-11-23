// 내 기록은 서버가 준비되기 전까지 브라우저(localStorage)에 저장해요
const STORAGE_KEY = "wap-records";
const MAX_FREE_TRADES = 50;

const emptyRecords = () => ({ terms: {}, scenarios: {}, freeTrades: [] });

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyRecords(), ...JSON.parse(saved) } : emptyRecords();
  } catch {
    return emptyRecords();
  }
}

function save(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // 저장 공간을 못 쓰는 환경이면 기록만 건너뛰어요
  }
}

export function getRecords() {
  return load();
}

// 용어(챕터) 퀴즈를 모두 맞혔는지 저장해요
export function saveTermResult(chapterName, correct) {
  const records = load();
  records.terms[chapterName] = { correct, date: Date.now() };
  save(records);
}

// 모의투자가 끝나면 시나리오 / 자유투자 결과를 저장해요
export function saveMockResult(scenario, result) {
  const records = load();
  const { profit, rate, trades } = result;

  if (scenario.mode === "free") {
    const sumQuantity = (type) =>
      trades
        .filter((trade) => trade.type === type)
        .reduce((sum, trade) => sum + trade.quantity, 0);

    records.freeTrades.unshift({
      stockName: scenario.stockName,
      rate,
      profit,
      bought: sumQuantity("buy"),
      sold: sumQuantity("sell"),
      date: Date.now(),
    });
    records.freeTrades = records.freeTrades.slice(0, MAX_FREE_TRADES);
  } else {
    records.scenarios[scenario.id] = { rate, profit, date: Date.now() };
  }

  save(records);
}
