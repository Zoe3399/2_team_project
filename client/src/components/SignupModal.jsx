// client/src/components/SignupModal.jsx
import React, { useState } from "react";
import "./LoginModal.css"; // 모달 스타일 재사용

export default function SignupModal({ onClose, setShowLogin }) {
  // 이메일 폼 표시 상태
  const [showEmailForm, setShowEmailForm] = useState(false);
  // 입력 필드 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 약관 동의 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  // 약관 상세 토글 상태
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showMarketing, setShowMarketing] = useState(false);
  // 에러 메시지 상태
  const [error, setError] = useState("");
  // 이메일 인증 화면 상태
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [code, setCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [isVerifyError, setIsVerifyError] = useState(false);

  // 카카오 회원가입 처리 (추후 OAuth 연동)
  const handleKakaoSignup = () => {
    console.log("카카오 회원가입 시작");
  };

  // 전체 동의 처리
  const handleAllChange = (checked) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };

  // 가입 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || password.length < 8 || password.length > 20 || !agreeTerms || !agreePrivacy) {
      setError("필수 항목에 모두 동의하고 입력해야 합니다.");
      return;
    }
    try {
      // 1) 회원가입 API 호출
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "회원가입에 실패했습니다.");
        return;
      }

      // 2) 인증 코드 발송 API 호출
      const codeRes = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!codeRes.ok) {
        setError("인증번호 발송에 실패했습니다.");
        return;
      }

      // 3) 인증 화면으로 전환
      setShowVerifyForm(true);
      setVerifyMessage("인증번호가 전송되었습니다.");
      setIsVerifyError(false);
    } catch (err) {
      console.error(err);
      setError("서버 에러가 발생했습니다. 나중에 다시 시도해주세요.");
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
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        window.alert("인증이 완료되었습니다.");
        onClose();
      } else {
        setVerifyMessage("이메일 인증이 실패하였습니다. 다시 시도해주세요.");
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
        body: JSON.stringify({ email }),
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
        {/* 모달 닫기 버튼 */}
        <button className="modal-close" onClick={onClose}>X</button>

        {!showEmailForm ? (
          <>
            {/* SNS 선택 화면 */}
            <h2>회원가입</h2>
            <button className="social-button kakao" onClick={handleKakaoSignup}>
              카카오로 가입
            </button>
            <button className="submit-button" onClick={() => setShowEmailForm(true)}>
              이메일로 가입
            </button>
            <p className="signup-guide">
              이미 계정이 있으신가요?{" "}
              <button
                className="link-button"
                onClick={() => {
                  onClose();
                  setShowLogin();
                }}
              >
                로그인
              </button>
            </p>
          </>
        ) : showVerifyForm ? (
          <>
            <h2>이메일 인증</h2>
            <input
              type="text"
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="login-form-input"
            />
            <div className="auth-actions">
              <button type="button" className="submit-button" onClick={handleVerify}>
                인증하기
              </button>
              <button type="button" className="submit-button secondary" onClick={handleResend}>
                재전송
              </button>
            </div>
            {verifyMessage && (
              <p className="error-text" style={{ color: isVerifyError ? "#d93025" : "#333" }}>
                {verifyMessage}
              </p>
            )}
          </>
        ) : (
          <>
            {/* 이메일 가입 폼 화면 */}
            <h2>이메일로 가입</h2>
            <form onSubmit={handleSubmit} className="login-form">
              {/* 이메일 입력 */}
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* 비밀번호 입력 */}
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={20}
              />
              <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 12px" }}>
                ※비밀번호는 8자 이상, 20자 이하로 입력해주세요.
              </p>

              {/* 약관 동의 그룹 */}
              <div className="checkbox-group">
                {/* 전체 동의 */}
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={(e) => handleAllChange(e.target.checked)}
                  />
                  모두 동의 (선택포함)
                </label>

                {/* 이용약관 동의 */}
                <div
                  className="checkbox"
                  onClick={() => setShowTerms(!showTerms)}
                >
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>(필수) 이용약관 동의</span>
                </div>
                {showTerms && (
                  <div className="agreement-detail">
                    <p>• 본인은 본 서비스에서 제공하는 기능을 정당하게 사용하며, 부정 사용 시 제재를 받을 수 있습니다.</p>
                    <p>• 서비스 이용 중 발생하는 콘텐츠에 대한 저작권은 해당 작성자에게 있습니다.</p>
                  </div>
                )}

                {/* 개인정보처리방침 동의 */}
                <div
                  className="checkbox"
                  onClick={() => setShowPrivacy(!showPrivacy)}
                >
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>(필수) 개인정보처리방침 동의</span>
                </div>
                {showPrivacy && (
                  <div className="agreement-detail">
                    <p>• 수집 항목: 이메일 주소, 비밀번호</p>
                    <p>• 사용 목적: 회원 인증, 분석 결과 저장 및 맞춤 서비스 제공</p>
                    <p>• 보유 기간: 탈퇴 요청 시까지 또는 관련 법령에 따름</p>
                  </div>
                )}

                {/* 마케팅 정보 수신 동의 */}
                <div
                  className="checkbox"
                  onClick={() => setShowMarketing(!showMarketing)}
                >
                  <input
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>(선택) 마케팅 정보 수신 동의</span>
                </div>
                {showMarketing && (
                  <div className="agreement-detail">
                    <p>• 이벤트, 업데이트 안내 등의 정보를 이메일로 받는 데 동의합니다.</p>
                    <p>• 언제든지 마이페이지에서 수신 거부할 수 있습니다.</p>
                  </div>
                )}
              </div>

              {/* 에러 메시지 */}
              {error && <p className="error-text">{error}</p>}
              {/* 가입하기 버튼 */}
              <button type="submit" className="submit-button">가입하기</button>
              {/* 로그인 전환 */}
              <p className="signup-guide">
                이미 계정이 있으신가요?{" "}
                <button
                  className="link-button"
                  onClick={() => {
                    onClose();
                    setShowLogin();
                  }}
                >
                  로그인
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}