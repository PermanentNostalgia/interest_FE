const SESSION_TOKEN_KEY = "session_token";

export function saveSessionToken(token) {
  window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function getSessionToken() {
  return window.sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function authenticatedFetch(input, options = {}) {
  const token = getSessionToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...options,
    headers,
    credentials: "omit",
  });
}

// 기록 페이지의 닉네임 표시용. 현재 로그인은 세션 토큰만 저장하므로 닉네임이 없으면 null.
export function getAuth() {
  try {
    return JSON.parse(window.localStorage.getItem("wap-auth")) ?? null;
  } catch {
    return null;
  }
}
