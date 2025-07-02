import React, { useState } from "react";
import "./LoginModal.css"; // 모달 스타일 재사용

// Kakao 타입 선언 (간단한 구조 정의)
interface KakaoAuth {
  authorize(options: { redirectUri: string }): void;
}

interface Kakao {
  Auth: KakaoAuth;
}

declare global {
  interface Window {
    Kakao?: Kakao;
  }
}

interface SignupModalProps {
  onClose: () => void;
  setShowLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, setShowLogin }) => {
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

  // 공통: 입력값 변경 시 에러 메시지 초기화 및 상태 업데이트 함수
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setError(""); // 입력 도중 에러 메시지 초기화
  };

  // 모달 닫기 및 상태 초기화 함수
  const resetAll = () => {
    setShowEmailForm(false);
    setShowVerifyForm(false);
    setEmail("");
    setPassword("");
    setAgreeAll(false);
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setAgreeMarketing(false);
    setShowTerms(false);
    setShowPrivacy(false);
    setShowMarketing(false);
    setError("");
    setCode("");
    setVerifyMessage("");
    setIsVerifyError(false);
  };

  // 모달 닫기 핸들러: 상태 초기화 후 부모 콜백 호출
  const handleCloseModal = () => {
    resetAll();
    onClose();
  };

  // 카카오 회원가입 처리 함수
  // 카카오 SDK가 로드되어 있으면 실제 카카오 인증창으로 이동
  // 인증 완료 후 redirectUri로 돌아오지 않고, 실제 서비스에서는
  // 카카오 인증 성공 시 window.postMessage 또는 JS 콜백을 통해
  // 모달 내에서 로그인 상태를 바로 변경할 수 있도록 구현 필요
  // (라우터 이동 없이 모달 상태로만 인증/회원가입 플로우 진행)
  const handleKakaoSignup = () => {
    if (typeof window.Kakao?.Auth?.authorize === "function") {
      window.Kakao.Auth.authorize({
        // 카카오 로그인 리디렉션 URL은 백엔드 서버 주소와 일치해야 함 (포트 5000)
        redirectUri: "http://localhost:5000/kakao-callback",
      });
      // 실제 서비스에서는 redirectUri 대신 팝업 내 콜백 처리로 변경 권장
      // 예: window.Kakao.Auth.login({
      //   success: function(authObj) {
      //     // 인증 성공 시 모달 내 로그인 상태 변경
      //     handleCloseModal();
      //     setShowLogin();
      //   },
      //   fail: function(err) {
      //     alert("카카오 로그인 실패: " + JSON.stringify(err));
      //   }
      // });
    } else {
      alert("카카오 SDK를 불러올 수 없습니다. 새로고침 해보세요.");
    }
  };

  // 전체 동의 체크박스 변경 시 모든 약관 동의 상태 동기화
  const handleAllChange = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };

  // 이메일 회원가입 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. 필수 입력값 및 약관 동의 확인
    if (!email || !password || password.length < 8 || password.length > 20 || !agreeTerms || !agreePrivacy) {
      setError("필수 항목에 모두 동의하고 입력해야 합니다.");
      return;
    }

    try {
      // 2. 회원가입 API 호출
      // ※ 백엔드 라우트(/api/auth/signup)와 반드시 일치해야 404 에러가 발생하지 않음
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      // 3. 회원가입 실패 시 에러 메시지 표시
      if (!res.ok) {
        setError(data.message || "회원가입에 실패했습니다.");
        return;
      }

      // 4. 인증 코드 발송 API 호출
      const codeRes = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // 5. 인증 코드 발송 실패 시 에러 메시지 표시
      if (!codeRes.ok) {
        setError("인증번호 발송에 실패했습니다.");
        return;
      }

      // 6. 인증번호 입력 화면으로 전환 및 안내 메시지 초기화
      setShowVerifyForm(true);
      setVerifyMessage("인증번호가 전송되었습니다.");
      setIsVerifyError(false);
    } catch (err) {
      console.error(err);
      setError("서버 에러가 발생했습니다. 나중에 다시 시도해주세요.");
    }
  };

  // 인증번호 입력 변경 시 상태 업데이트 및 메시지 초기화
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setVerifyMessage("");
    setIsVerifyError(false);
  };

  // 인증번호 검증 처리 함수
  const handleVerify = async () => {
    // 인증번호 미입력 시 안내 메시지 표시
    if (!code) {
      setVerifyMessage("인증번호를 입력해주세요.");
      setIsVerifyError(true);
      return;
    }
    try {
      // 인증 코드 검증 API 호출
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        // 인증 성공 시 모달 닫고 로그인 모달 표시
        handleCloseModal();
        setShowLogin();
      } else {
        // 인증 실패 시 에러 메시지 표시
        setVerifyMessage("이메일 인증이 실패하였습니다. 다시 시도해주세요.");
        setIsVerifyError(true);
      }
    } catch {
      // 서버 오류 시 에러 메시지 표시
      setVerifyMessage("서버 오류가 발생했습니다.");
      setIsVerifyError(true);
    }
  };

  // 인증번호 재전송 처리 함수
  const handleResend = async () => {
    try {
      // 인증번호 재전송 API 호출
      // 실제 API 경로는 백엔드와 맞춰야 하며, 404 에러 방지 필수
      await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // 재전송 성공 시 안내 메시지
      setVerifyMessage("인증번호를 다시 발송했습니다.");
      setIsVerifyError(false);
    } catch {
      // 재전송 실패 시 에러 메시지
      setVerifyMessage("재전송에 실패했습니다.");
      setIsVerifyError(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 모달 닫기 버튼 */}
        <button className="modal-close" onClick={handleCloseModal}>X</button>

        {!showEmailForm ? (
          <>
            {/* SNS 선택 화면 */}
            <h2>회원가입</h2>
            {/* 카카오 회원가입 버튼 */}
            <button className="social-button kakao" onClick={handleKakaoSignup}>
              카카오로 가입
            </button>
            {/* 이메일 회원가입 화면 전환 버튼 */}
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
            {/* 이메일 인증 화면 */}
            <h2>이메일 인증</h2>
            <input
              type="text"
              placeholder="인증번호 입력"
              value={code}
              onChange={handleCodeChange}
              className="login-form-input"
            />
            <div className="auth-actions">
              {/* 인증하기 버튼 */}
              <button type="button" className="submit-button" onClick={handleVerify}>
                인증하기
              </button>
              {/* 인증번호 재전송 버튼 */}
              <button type="button" className="submit-button secondary" onClick={handleResend}>
                재전송
              </button>
            </div>
            {/* 인증 관련 메시지 표시 */}
            {verifyMessage && (
              <p className="error-text" style={{ color: isVerifyError ? "#d93025" : "#333" }}>
                {verifyMessage}
              </p>
            )}
          </>
        ) : (
          <>
            {/* 이메일 회원가입 폼 화면 */}
            <h2>이메일로 가입</h2>
            <form onSubmit={handleSubmit} className="login-form">
              {/* 이메일 입력 */}
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={handleInputChange(setEmail)}
                required
              />
              {/* 비밀번호 입력 */}
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={handleInputChange(setPassword)}
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
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span onClick={() => setShowTerms(!showTerms)}>(필수) 이용약관 동의</span>
                </label>
                {showTerms && (
                  <div className="agreement-detail">
                    <p>• 본인은 본 서비스에서 제공하는 기능을 정당하게 사용하며, 부정 사용 시 제재를 받을 수 있습니다.</p>
                    <p>• 서비스 이용 중 발생하는 콘텐츠에 대한 저작권은 해당 작성자에게 있습니다.</p>
                  </div>
                )}

                {/* 개인정보처리방침 동의 */}
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                  />
                  <span onClick={() => setShowPrivacy(!showPrivacy)}>(필수) 개인정보처리방침 동의</span>
                </label>
                {showPrivacy && (
                  <div className="agreement-detail">
                    <p>• 수집 항목: 이메일 주소, 비밀번호</p>
                    <p>• 사용 목적: 회원 인증, 분석 결과 저장 및 맞춤 서비스 제공</p>
                    <p>• 보유 기간: 탈퇴 요청 시까지 또는 관련 법령에 따름</p>
                  </div>
                )}

                {/* 마케팅 정보 수신 동의 */}
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                  />
                  <span onClick={() => setShowMarketing(!showMarketing)}>(선택) 마케팅 정보 수신 동의</span>
                </label>
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

export default SignupModal;