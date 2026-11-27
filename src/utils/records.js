import { getSessionToken } from "./auth.js";

// 내 기록은 서버가 준비되기 전까지 브라우저(localStorage)에 저장해요
const STORAGE_KEY = "wap-records";
const MAX_FREE_TRADES = 50;
const SEGMENT_MATRIX = [["interest","market-cap","per","pbr","roe"],
             ["eps","operating-profit","bond","debt-ratio","revenue"]]

const emptyRecords = () => ({ terms: {}, scenarios: {}, freeTrades: [] });

function load() {
  let isFetched = true;
  const record = emptyRecords();
  if(getSessionToken()!=null) {
    fetch("/api/users/me",{
      method: "GET",
      headers: {"Authorization": `Bearer ${getSessionToken()}`}
    }).then(response => response.json()
    ).then(progressData => {
      console.log("gi", progressData)
      for(const chapter of progressData.chap1) {
        if(1<=chapter.id && chapter.id<=3 && 0<=chapter.progress && chapter.progress<5) {
          const segment = SEGMENT_MATRIX[chapter.id-1][chapter.progress];
          record.terms[segment] = {correct: true, date: 0};
        }
      }
    }).catch((error) => {
      isFetched = false;
      console.log(error);
    })
  }

  if(!isFetched) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...emptyRecords(), ...JSON.parse(saved) } : emptyRecords();
    } catch {
      return emptyRecords();
    }
  } else {
    return record;
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
  if(getSessionToken()!=null) {
    let id = 1, progress = 0;
    for(;id<=SEGMENT_MATRIX.length;id++) {
      for(;progress<5; progress++) {
        if(SEGMENT_MATRIX[id-1][progress]==chapterName) break;
      }
    }
    fetch(`/api/users/me/chap1/${id}`,{
      method: "PATCH",
      headers: {"Content-Type": "application/json", Authorization: `Bearer ${getSessionToken()}`},
      body: JSON.stringify({
        "progress": progress,
        isCleared: true 
      })
    })

    return;
  }

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
