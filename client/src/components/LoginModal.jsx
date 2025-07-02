import React, { useState } from "react";
import "./LoginModal.css"; // 모달 전용 스타일 시트
import { useNavigate } from "react-router-dom";

// 로그인 모달 컴포넌트 정의
export default function LoginModal({ onClose, setShowSignup }) {
  const navigate = useNavigate();
  // 입력 상태 관리: 이메일, 비밀번호, 에러 메시지
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isPasswordVerify, setIsPasswordVerify] = useState(false);
  const [emailForVerify, setEmailForVerify] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [isSendError, setIsSendError] = useState(false);
  const [code, setCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [isVerifyError, setIsVerifyError] = useState(false);

  // 로그인 처리 함수 (API 연동)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // 토큰 저장
        localStorage.setItem("authToken", data.token);
        // 필요 시 전역 상태에 user 정보 저장 가능: data.user
        onClose(); // 로그인 성공 시 모달 닫기
      } else {
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("서버 에러가 발생했습니다. 나중에 다시 시도해주세요.");
    }
  };

  // 카카오 로그인 처리 함수 (연동은 추후 구현)
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 시작");
    // 예: window.location.href = `https://kauth.kakao.com/oauth/authorize?...`;
  };

  const handleSendEmail = async () => {
    if (!emailForVerify) {
      setSendMessage("이메일을 입력해주세요.");
      setIsSendError(true);
      return;
    }
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForVerify }),
      });
      if (res.ok) {
        setShowCodeInput(true);
        setSendMessage("인증번호가 전송되었습니다.");
        setIsSendError(false);
      } else if (res.status === 404) {
        setSendMessage("가입되지 않은 이메일 입니다.");
        setIsSendError(true);
      } else {
        setSendMessage("인증번호가 발송되지 않았습니다.");
        setIsSendError(true);
      }
    } catch {
      setSendMessage("인증번호 발송에 실패했습니다.");
      setIsSendError(true);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      setVerifyMessage("인증번호를 입력해주세요.");
      setIsVerifyError(true);
      return;
    }
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForVerify, code }),
      });
      if (res.ok) {
        window.alert("인증이 완료되었습니다.");
        onClose();
      } else {
        setVerifyMessage("인증에 실패했습니다. 다시 시도해주세요.");
        setIsVerifyError(true);
      }
    } catch {
      setVerifyMessage("서버 오류가 발생했습니다.");
      setIsVerifyError(true);
    }
  };

  const handleResend = async () => {
    try {
      await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForVerify }),
      });
      setVerifyMessage("인증번호를 다시 발송했습니다.");
      setIsVerifyError(false);
    } catch {
      setVerifyMessage("재전송에 실패했습니다.");
      setIsVerifyError(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>

        {!isPasswordVerify ? (
          <>
            <h2>로그인</h2>

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

            <p className="signup-guide">
              비밀번호를 잊으셨나요?{" "}
              <button className="link-button" onClick={() => setIsPasswordVerify(true)}>
                비밀번호 찾기
              </button>
            </p>

            <p className="signup-guide">
              아직 회원이 아니신가요?{" "}
              <button
                className="link-button"
                onClick={() => {
                  setShowSignup(true);
                  onClose();
                }}
              >
                회원가입
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="back-title" onClick={() => setIsPasswordVerify(false)}>
              <span className="back-arrow">&larr;</span> 비밀번호 찾기
            </h2>
            {!showCodeInput ? (
              <>
                <input
                  type="email"
                  placeholder="이메일 입력"
                  value={emailForVerify}
                  onChange={(e) => setEmailForVerify(e.target.value)}
                  className="login-form-input"
                />
                <button className="submit-button" onClick={handleSendEmail}>
                  인증번호 전송
                </button>
                {sendMessage && <p className="error-text" style={{ color: isSendError ? "#d93025" : "#333" }}>{sendMessage}</p>}
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="login-form-input"
                />
                <div className="auth-actions">
                  <button className="submit-button secondary" onClick={handleResend}>재전송</button>
                  <button className="submit-button" onClick={handleVerify}>인증하기</button>
                </div>
                {verifyMessage && <p className="error-text" style={{ color: isVerifyError ? "#d93025" : "#333" }}>{verifyMessage}</p>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}