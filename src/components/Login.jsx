import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    navigate('/amain');
  };

  return (
    <main className="login-page">
      <section className="login-card">

        <div className="logo-area">
          <h1>금리도 모르면서</h1>
          <span>What is an interest rate?</span>
        </div>

        <div className="welcome-area">
          <h2>Welcome to Our Web</h2>
          <p>
            배움을 시작하려면<br />
            카카오 계정으로 로그인해주세요.
          </p>
        </div>

        <div className="login-area">
          <button
            className="kakao-button"
            onClick={handleKakaoLogin}
          >
            <span className="kakao-icon">K</span>
            <span>카카오로 로그인</span>
          </button>
        </div>

        <p className="login-info">
          카카오 계정으로 간편하게 로그인할 수 있습니다.
        </p>

      </section>
    </main>
  );
}

export default Login;