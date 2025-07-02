import React, { useState } from "react";
import "./LoginModal.css"; // 모달 전용 스타일 시트

// 로그인 모달 컴포넌트 정의
export default function LoginModal({ onClose, setShowSignup }) {
  // 입력 상태 관리: 이메일, 비밀번호, 에러 메시지
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 로그인 처리 함수 (API 연동 예정)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    console.log("로그인 시도", { email, password });
    onClose(); // 로그인 성공 시 모달 닫기
  };

  // 카카오 로그인 처리 함수 (연동은 추후 구현)
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 시작");
    // 예: window.location.href = `https://kauth.kakao.com/oauth/authorize?...`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 모달 닫기 버튼 */}
        <button className="modal-close" onClick={onClose}>X</button>

        {/* 모달 제목 */}
        <h2>로그인</h2>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="login-form">
          {/* 이메일 입력 필드 */}
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 비밀번호 입력 필드 */}
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 에러 메시지 출력 */}
          {error && <p className="error-text">{error}</p>}

          {/* 이메일 로그인 버튼 */}
          <button
            type="submit"
            className="submit-button"
            style={{ marginBottom: "12px" }}
          >
            이메일로 로그인
          </button>

          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            className="social-button kakao"
            onClick={handleKakaoLogin}
          >
            카카오 로그인
          </button>
        </form>

        {/* 회원가입 이동 안내 */}
        <p className="signup-guide">
          아직 회원이 아니신가요?{" "}
          <button
            className="link-button"
            onClick={() => {
              setShowSignup(true); // 회원가입 모달 열기
              onClose();           // 현재 모달 닫기
            }}
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}