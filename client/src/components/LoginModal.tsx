import { useState } from "react";
import "./LoginModal.css"; // 모달 전용 스타일 시트
import { useAuth } from "../contexts/AuthContext";

// 로그인 모달 컴포넌트 정의
interface LoginModalProps {
  onClose: () => void;
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function LoginModal({ onClose, setShowSignup }: LoginModalProps) {

  // 상태 관리: 이메일, 비밀번호, 에러 메시지 등 입력 및 UI 상태
  const [email, setEmail] = useState(""); // 로그인 이메일
  const [password, setPassword] = useState(""); // 로그인 비밀번호
  const [error, setError] = useState(""); // 로그인 에러 메시지

  const [isPasswordVerify, setIsPasswordVerify] = useState(false); // 비밀번호 찾기 모드 활성화 여부
  const [emailForVerify, setEmailForVerify] = useState(""); // 비밀번호 찾기용 이메일
  const [showCodeInput, setShowCodeInput] = useState(false); // 인증번호 입력폼 표시 여부
  const [sendMessage, setSendMessage] = useState(""); // 인증번호 전송 메시지
  const [isSendError, setIsSendError] = useState(false); // 인증번호 전송 에러 여부
  const [code, setCode] = useState(""); // 인증번호 입력값
  const [verifyMessage, setVerifyMessage] = useState(""); // 인증 결과 메시지
  const [isVerifyError, setIsVerifyError] = useState(false); // 인증 결과 에러 여부

  const [showResetPw, setShowResetPw] = useState(false); // 비밀번호 재설정 폼 표시 여부
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호 입력값
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인 입력값
  const [resetPwMessage, setResetPwMessage] = useState(""); // 비밀번호 재설정 메시지
  const [isResetPwError, setIsResetPwError] = useState(false); // 비밀번호 재설정 에러 여부

  const { login } = useAuth();

  /**
   * 공통 입력 변경 핸들러
   * 각 입력 필드에서 호출되며, 입력값 설정과 동시에 에러 및 메시지를 초기화하여
   * 사용자 경험 개선 및 중복 코드 제거
   * @param {Function} setState - 상태 업데이트 함수
   * @param {Function} resetError - 에러 및 메시지 초기화 함수
   * @returns {Function} - 이벤트 핸들러 함수
   */
  const handleInputChange = (
    setState: React.Dispatch<React.SetStateAction<string>>,
    resetError: () => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
    resetError();
  };

  // 로그인 폼 관련 에러 초기화 함수
  const resetLoginError = () => setError("");

  // 인증번호 전송 메시지 및 에러 초기화 함수
  const resetSendMessage = () => {
    setSendMessage("");
    setIsSendError(false);
  };

  // 인증 결과 메시지 및 에러 초기화 함수
  const resetVerifyMessage = () => {
    setVerifyMessage("");
    setIsVerifyError(false);
  };

  // 비밀번호 재설정 메시지 및 에러 초기화 함수
  const resetResetPwMessage = () => {
    setResetPwMessage("");
    setIsResetPwError(false);
  };

  /**
   * 이메일 로그인 처리 함수
   * 이메일과 비밀번호를 서버에 보내 로그인 시도 후 성공 시 모달 닫기
   * @param {Event} e - 폼 제출 이벤트
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    resetLoginError();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    const { success, message } = await login(email, password);
    if (success) {
      onClose(); // 로그인 성공 시 모달 닫기
    } else {
      setError(message);
    }
  };

  /**
   * 카카오 로그인 처리 함수
   * 실제 카카오 OAuth 인증 URL로 리다이렉트하여 연동 구현
   */
  const handleKakaoLogin = () => {
    // 카카오 REST API 키 및 리다이렉트 URI는 실제 환경에 맞게 변경 필요
    const REST_API_KEY = "YOUR_KAKAO_REST_API_KEY";
    const REDIRECT_URI = `${window.location.origin}/oauth/kakao/callback`;
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code`;

    window.location.href = kakaoAuthURL;
  };

  /**
   * 인증번호 전송 처리 함수
   * 입력된 이메일로 인증번호 요청 후 UI 상태 및 메시지 업데이트
   */
  const handleSendEmail = async () => {
    resetSendMessage();
    resetVerifyMessage();
    resetResetPwMessage();

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

  /**
   * 인증번호 검증 처리 함수
   * 인증번호가 맞으면 비밀번호 재설정 폼을 보여줌
   */
  const handleVerify = async () => {
    resetVerifyMessage();
    resetResetPwMessage();

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
        setShowResetPw(true); // 인증 성공 시 비밀번호 재설정 폼 표시
      } else {
        setVerifyMessage("인증에 실패했습니다. 다시 시도해주세요.");
        setIsVerifyError(true);
      }
    } catch {
      setVerifyMessage("서버 오류가 발생했습니다.");
      setIsVerifyError(true);
    }
  };

  /**
   * 인증번호 재전송 처리 함수
   * 인증번호를 다시 발송 요청 후 메시지 업데이트
   */
  const handleResend = async () => {
    resetVerifyMessage();
    resetResetPwMessage();

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForVerify }),
      });
      if (res.ok) {
        setVerifyMessage("인증번호를 다시 발송했습니다.");
        setIsVerifyError(false);
      } else {
        setVerifyMessage("재전송에 실패했습니다.");
        setIsVerifyError(true);
      }
    } catch {
      setVerifyMessage("재전송에 실패했습니다.");
      setIsVerifyError(true);
    }
  };

  /**
   * 비밀번호 재설정 처리 함수
   * 새 비밀번호와 확인 비밀번호 일치 및 유효성 검사 후 서버에 요청
   * 성공 시 모달 닫음
   */
  const handleResetPassword = async () => {
    resetResetPwMessage();

    if (!newPassword || !confirmPassword) {
      setResetPwMessage("새 비밀번호와 확인 비밀번호를 모두 입력해주세요.");
      setIsResetPwError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetPwMessage("비밀번호가 일치하지 않습니다.");
      setIsResetPwError(true);
      return;
    }

    // 비밀번호 유효성 검사 예시 (최소 6자 이상)
    if (newPassword.length < 6) {
      setResetPwMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      setIsResetPwError(true);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForVerify, newPassword }),
      });
      if (res.ok) {
        window.alert("비밀번호가 성공적으로 변경되었습니다.");
        onClose(); // 비밀번호 재설정 완료 후 모달 닫기
      } else {
        setResetPwMessage("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        setIsResetPwError(true);
      }
    } catch {
      setResetPwMessage("서버 오류가 발생했습니다.");
      setIsResetPwError(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 모달 닫기 버튼 */}
        <button className="modal-close" onClick={onClose}>X</button>

        {/* 비밀번호 찾기 모드가 아닐 때 (기본 로그인 폼) */}
        {!isPasswordVerify ? (
          <>
            <h2>로그인</h2>

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="login-form">
              {/* 이메일 입력 필드 */}
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={handleInputChange(setEmail, resetLoginError)}
                required
              />

              {/* 비밀번호 입력 필드 */}
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={handleInputChange(setPassword, resetLoginError)}
                required
              />

              {/* 로그인 에러 메시지 출력 */}
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

            {/* 비밀번호 찾기 및 회원가입 링크 */}
            <p className="signup-guide">
              비밀번호를 잊으셨나요?{" "}
              <button className="link-button" onClick={() => {
                // 비밀번호 찾기 모드 활성화 및 관련 상태 초기화
                setIsPasswordVerify(true);
                setEmailForVerify("");
                setShowCodeInput(false);
                setSendMessage("");
                setIsSendError(false);
                setCode("");
                setVerifyMessage("");
                setIsVerifyError(false);
                setShowResetPw(false);
                setNewPassword("");
                setConfirmPassword("");
                setResetPwMessage("");
                setIsResetPwError(false);
              }}>
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
            {/* 비밀번호 찾기 모드 헤더 및 뒤로가기 */}
            <h2 className="back-title" onClick={() => setIsPasswordVerify(false)}>
              <span className="back-arrow">&larr;</span> 비밀번호 찾기
            </h2>

            {/* 인증번호 입력 전 단계 */}
            {!showCodeInput && !showResetPw && (
              <>
                {/* 이메일 입력 필드 */}
                <input
                  type="email"
                  placeholder="이메일 입력"
                  value={emailForVerify}
                  onChange={handleInputChange(setEmailForVerify, resetSendMessage)}
                  className="login-form-input"
                />
                {/* 인증번호 전송 버튼 */}
                <button className="submit-button" onClick={handleSendEmail}>
                  인증번호 전송
                </button>
                {/* 인증번호 전송 메시지 */}
                {sendMessage && (
                  <p
                    className="error-text"
                    style={{ color: isSendError ? "#d93025" : "#333" }}
                  >
                    {sendMessage}
                  </p>
                )}
              </>
            )}

            {/* 인증번호 입력 및 인증 단계 */}
            {showCodeInput && !showResetPw && (
              <>
                {/* 인증번호 입력 필드 */}
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={code}
                  onChange={handleInputChange(setCode, resetVerifyMessage)}
                  className="login-form-input"
                />
                {/* 인증번호 재전송 및 인증하기 버튼 */}
                <div className="auth-actions">
                  <button className="submit-button secondary" onClick={handleResend}>재전송</button>
                  <button className="submit-button" onClick={handleVerify}>인증하기</button>
                </div>
                {/* 인증 결과 메시지 */}
                {verifyMessage && (
                  <p
                    className="error-text"
                    style={{ color: isVerifyError ? "#d93025" : "#333" }}
                  >
                    {verifyMessage}
                  </p>
                )}
              </>
            )}

            {/* 비밀번호 재설정 폼 */}
            {showResetPw && (
              <>
                {/* 새 비밀번호 입력 필드 */}
                <input
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={newPassword}
                  onChange={handleInputChange(setNewPassword, resetResetPwMessage)}
                  className="login-form-input"
                />
                {/* 새 비밀번호 확인 입력 필드 */}
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword, resetResetPwMessage)}
                  className="login-form-input"
                />
                {/* 비밀번호 재설정 버튼 */}
                <button className="submit-button" onClick={handleResetPassword}>
                  비밀번호 재설정
                </button>
                {/* 비밀번호 재설정 메시지 */}
                {resetPwMessage && (
                  <p
                    className="error-text"
                    style={{ color: isResetPwError ? "#d93025" : "#333" }}
                  >
                    {resetPwMessage}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}