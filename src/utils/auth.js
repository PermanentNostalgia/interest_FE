const AUTH_KEY = "wap-auth";

export function saveAuth(responseBody) {
  try {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        token: responseBody?.token,
        nickname: responseBody?.nickname,
        profileImageUrl: responseBody?.profileImageUrl,
      }),
    );
  } catch {
    /* 저장 불가 환경이면 건너뜀 */
  }
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    /* noop */
  }
}
