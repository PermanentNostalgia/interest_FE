import { authenticatedFetch } from "../utils/auth";

// 배포 환경에서는 빈 값, vercel.json의 rewrites 사용
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function request(path, options, fetcher = fetch) {
  const response = await fetcher(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`요청에 실패했어요 (${response.status})`);
  }
  return response.json();
}

// 자유 투자 종목 조회. 목록에는 종목코드와 시세가 없어 상세까지 요청
export async function fetchStocks() {
  // 5초 동안 응답이 없으면 실패 처리
  const options = { signal: AbortSignal.timeout(5000) };
  const list = await request("/scenarios", options);
  return Promise.all(
    list.map(({ id }) => request(`/scenarios/${id}`, options))
  );
}

export function saveSimulationResult(payload) {
  return request(
    "/simulation-results",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    authenticatedFetch
  );
}

export async function fetchSimulationResults() {
  const results = await request("/simulation-results", {}, authenticatedFetch);

  // authToken은 사용하지 않으므로 제거
  results.forEach((result) => delete result.authToken);
  return results;
}
