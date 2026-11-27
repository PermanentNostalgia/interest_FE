// 내 기록은 localStorage에 저장, 자유 투자는 서버 기록과 합쳐서 표시
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

function toFreeTrade({ stockName, rate, profit, trades, playedAt }) {
  const sumQuantity = (type) =>
    trades
      .filter((trade) => trade.type === type)
      .reduce((sum, trade) => sum + trade.quantity, 0);

  return {
    stockName,
    rate,
    profit,
    bought: sumQuantity("buy"),
    sold: sumQuantity("sell"),
    date: playedAt,
  };
}

// 모의투자가 끝나면 시나리오 / 자유투자 결과를 저장해요
export function saveMockResult(scenario, result, playedAt = Date.now()) {
  const records = load();
  const { profit, rate } = result;

  if (scenario.mode === "free") {
    records.freeTrades.unshift(
      toFreeTrade({ stockName: scenario.stockName, ...result, playedAt })
    );
    records.freeTrades = records.freeTrades.slice(0, MAX_FREE_TRADES);
  } else {
    records.scenarios[scenario.id] = { rate, profit, date: playedAt };
  }

  save(records);
}

// POST /simulation-results 요청 body (자유 투자)
export function makeFreePayload(scenario, result, playedAt) {
  return {
    mode: "free",
    stockCode: scenario.companyInfo.stockCode,
    stockName: scenario.stockName,
    startCash: scenario.startCash,
    ...result,
    playedAt,
  };
}

// 서버 기록과 브라우저 기록 병합. 같은 판은 playedAt으로 구분
export function mergeFreeTrades(freeTrades, serverResults) {
  const merged = new Map(freeTrades.map((trade) => [trade.date, trade]));

  serverResults
    .filter((result) => result.mode === "free")
    .forEach((result) => merged.set(result.playedAt, toFreeTrade(result)));

  return [...merged.values()].sort((a, b) => b.date - a.date);
}

// 유닛(용어 학습) 기록을 모두 지워요
export function resetTermRecords() {
  const records = load();
  records.terms = {};
  save(records);
}

// 시나리오 기록을 모두 지워요
export function resetScenarioRecords() {
  const records = load();
  records.scenarios = {};
  save(records);
}
