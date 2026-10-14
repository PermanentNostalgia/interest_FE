import { useEffect, useRef, useState } from "react";
import loginLogo from "../../assets/login-logo.png";
import "./login.css";

const patternTiles = Array.from({ length: 105 }, (_, index) => (
  <span className="login-pattern-tile" key={index} />
));

const KAKAO_STATE_KEY = "kakao_oauth_state";

function getRedirectUri() {
  return `${window.location.origin}${window.location.pathname}`;
}

function getKakaoLoginEndpoint(apiBaseUrl, kakaoLoginEndpoint) {
  if (kakaoLoginEndpoint) return kakaoLoginEndpoint;
  return `${apiBaseUrl.replace(/\/+$/, "")}/api/auth/kakao`;
}

function StatusIcons() {
  return (
    <span className="login-status-icons" aria-hidden="true">
      <svg viewBox="0 0 18 12">
        <path d="M1 11V8h3v3M6 11V6h3v5m2 0V3h3v8m2 0V1h3v10" />
      </svg>
      <svg viewBox="0 0 17 13">
        <path d="M1 4.5C5.3.8 11.7.8 16 4.5L8.5 12 1 4.5Z" />
      </svg>
      <svg className="login-battery" viewBox="0 0 28 14">
        <rect x=".75" y=".75" width="24" height="12.5" rx="3.5" />
        <path d="M26.5 4.5v5" />
        <rect
          className="login-battery-fill"
          x="3"
          y="3"
          width="19"
          height="8"
          rx="2"
        />
      </svg>
    </span>
  );
}

function KakaoIcon() {
  return (
    <svg
      className="login-kakao-icon"
      viewBox="0 0 20 18"
      aria-hidden="true"
    >
      <path d="M10 1C5.03 1 1 4.12 1 7.97c0 2.46 1.66 4.62 4.15 5.85l-.84 3.1a.4.4 0 0 0 .61.43l3.8-2.52c.42.06.84.1 1.28.1 4.97 0 9-3.12 9-6.96S14.97 1 10 1Z" />
    </svg>
  );
}

function LoginLogo() {
  return (
    <img
      className="login-logo"
      src={loginLogo}
      aria-label="금리도 모르면서 로고"
      alt="금리도 모르면서 로고"
    />
  );
}

export default function Login({
  kakaoRestApiKey = "1304ac232764438b146d93b3f07f9624",
  apiBaseUrl = "",
  kakaoLoginEndpoint = import.meta.env.VITE_KAKAO_LOGIN_ENDPOINT,
  onLoginSuccess,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const callbackStarted = useRef(false);

  useEffect(() => {
    const callbackUrl = new URL(window.location.href);
    const kakaoError = callbackUrl.searchParams.get("error");
    const authorizationCode = callbackUrl.searchParams.get("code");
    const receivedState = callbackUrl.searchParams.get("state");

    if (kakaoError) {
      setErrorMessage(
        callbackUrl.searchParams.get("error_description") ||
          "카카오 로그인을 취소했거나 인증에 실패했습니다.",
      );
      callbackUrl.searchParams.delete("error");
      callbackUrl.searchParams.delete("error_description");
      callbackUrl.searchParams.delete("state");
      window.history.replaceState({}, "", callbackUrl);
      return;
    }

    if (!authorizationCode || callbackStarted.current) return;
    callbackStarted.current = true;
    setIsLoading(true);
    setErrorMessage("");
    callbackUrl.searchParams.delete("code");
    callbackUrl.searchParams.delete("state");
    window.history.replaceState({}, "", callbackUrl);

    let expectedState;
    try {
      expectedState = window.sessionStorage.getItem(KAKAO_STATE_KEY);
      window.sessionStorage.removeItem(KAKAO_STATE_KEY);
    } catch {
      setErrorMessage("브라우저에서 로그인 세션을 확인할 수 없습니다.");
      setIsLoading(false);
      return;
    }

    if (!expectedState || receivedState !== expectedState) {
      setErrorMessage("로그인 요청을 확인할 수 없습니다. 다시 시도해 주세요.");
      setIsLoading(false);
      return;
    }

    const redirectUri = getRedirectUri();

    fetch(getKakaoLoginEndpoint(apiBaseUrl, kakaoLoginEndpoint), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: authorizationCode, redirectUri }),
    })
      .then(async (response) => {
        const responseText = await response.text();
        let responseBody = {};
        if (responseText.trim()) {
          try {
            responseBody = JSON.parse(responseText);
          } catch {
            throw new Error(
              `로그인 서버가 올바른 JSON 응답을 반환하지 않았습니다. (HTTP ${response.status})`,
            );
          }
        }

        if (!response.ok) {
          throw new Error(
            responseBody?.message ||
              `카카오 로그인 처리에 실패했습니다. (HTTP ${response.status})`,
          );
        }
        return responseBody;
      })
      .then((responseBody) => {
        setStatusMessage("로그인되었습니다.");
        if (onLoginSuccess) onLoginSuccess(responseBody?.user);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof TypeError
            ? "로그인 서버에 연결할 수 없습니다. 서버 상태와 CORS 설정을 확인해 주세요."
            : error.message ||
                "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [apiBaseUrl, kakaoLoginEndpoint, onLoginSuccess]);

  function startKakaoLogin() {
    setErrorMessage("");
    setStatusMessage("");

    if (!kakaoRestApiKey.trim()) {
      setErrorMessage("카카오 REST API 키를 Login 설정에 입력해 주세요.");
      return;
    }

    const redirectUri = getRedirectUri();
    const randomState = new Uint8Array(32);
    try {
      window.crypto.getRandomValues(randomState);
    } catch {
      setErrorMessage("안전한 로그인 연결을 시작할 수 없습니다.");
      return;
    }
    const state = Array.from(randomState, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");

    try {
      window.sessionStorage.setItem(KAKAO_STATE_KEY, state);
    } catch {
      setErrorMessage("브라우저에서 로그인 세션을 저장할 수 없습니다.");
      return;
    }

    const authorizeUrl = new URL("https://kauth.kakao.com/oauth/authorize");
    authorizeUrl.search = new URLSearchParams({
      client_id: kakaoRestApiKey.trim(),
      redirect_uri: redirectUri,
      response_type: "code",
      state,
    }).toString();

    window.location.assign(authorizeUrl.toString());
  }

  return (
    <main className="login-screen">
      <div className="login-background" aria-hidden="true">
        <div className="login-pattern">{patternTiles}</div>
      </div>

      <div className="login-status" aria-label="상태 표시줄">
        <span className="login-time">9:41</span>
        <StatusIcons />
      </div>

      <div className="login-brand">
        <LoginLogo />
        <h1 className="login-title">
          금리도
          <br />
          모르면서
        </h1>
      </div>

      <section className="login-actions" aria-label="계정 로그인">
        <p className="login-signup">SNS 계정으로 간편 가입하기</p>
        <button
          className="login-kakao"
          type="button"
          onClick={startKakaoLogin}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          <KakaoIcon />
          <span>
            {isLoading ? "로그인 처리 중..." : "카카오계정으로 로그인"}
          </span>
        </button>
        {errorMessage && (
          <p className="login-feedback login-feedback--error" role="alert">
            {errorMessage}
          </p>
        )}
        {statusMessage && (
          <p className="login-feedback" role="status">
            {statusMessage}
          </p>
        )}
      </section>

      <div className="login-home-indicator" aria-hidden="true" />
    </main>
  );
}
