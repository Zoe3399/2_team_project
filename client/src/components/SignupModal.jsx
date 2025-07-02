// client/src/components/SignupModal.jsx
import React, { useState } from "react";
import "./LoginModal.css"; // 스타일 재사용


export default function SignupModal({ onClose, setShowLogin }) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [error, setError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showMarketing, setShowMarketing] = useState(false);

  const handleKakaoSignup = () => {
    console.log("카카오 회원가입 시작");
    // 카카오 OAuth 연동 필요
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>

        {!showEmailForm ? (
          <>
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
        ) : (
          <>
            <h2>이메일로 가입</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email || !password || !agreeTerms || !agreePrivacy) {
                  setError("필수 항목에 모두 동의하고 입력해야 합니다.");
                  return;
                }
                console.log("회원가입:", { email, password, agreeMarketing });
                onClose();
              }}
              className="login-form"
            >
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="checkbox-group">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTerms && agreePrivacy && agreeMarketing}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAgreeTerms(checked);
                      setAgreePrivacy(checked);
                      setAgreeMarketing(checked);
                    }}
                  />
                  모두 동의 (선택포함)
                </label>

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
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit" className="submit-button">
                가입하기
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
            </form>
          </>
        )}
      </div>
    </div>
  );
}