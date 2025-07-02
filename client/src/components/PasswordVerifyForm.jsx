// 인증번호 입력 + 인증/재전송
import React, { useState } from "react";
import "./LoginModal.css"; // or the modal CSS file you use

const PasswordVerifyForm = ({ onClose, email, onVerified }) => {
  // Step 2: Add state hooks
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [isSendError, setIsSendError] = useState(false);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isResetError, setIsResetError] = useState(false);

  // Step 3: Add send-code handler
  const handleSendEmail = async () => {
    if (!email) {
      setSendMessage("이메일을 입력해주세요.");
      setIsSendError(true);
      return;
    }
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setShowCodeInput(true);
        setSendMessage("인증번호가 전송되었습니다.");
        setIsSendError(false);
      } else if (res.status === 404) {
        setSendMessage("가입되지 않은 이메일 입니다.");
        setIsSendError(true);
        return;
      } else {
        setSendMessage("인증번호가 발송되지 않았습니다.");
        setIsSendError(true);
        return;
      }
    } catch {
      setSendMessage("인증번호 발송에 실패했습니다.");
      setIsSendError(true);
    }
  };

  // Modified handleVerify
  const handleVerify = async () => {
    if (!code) {
      setMessage("인증번호를 입력해주세요.");
      setIsError(true);
      return;
    }
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        setMessage("");
        setIsError(false);
        setShowResetForm(true);
        setResetMessage("");
      } else {
        setMessage("인증번호가 올바르지 않습니다.");
        setIsError(true);
      }
    } catch {
      setMessage("서버 오류가 발생했습니다.");
      setIsError(true);
    }
  };

  const handleResend = () => {
    setCode("");
    setMessage("");
    setIsError(false);
    handleSendEmail();
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setResetMessage("새 비밀번호와 확인을 모두 입력해주세요.");
      setIsResetError(true);
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 20) {
      setResetMessage("비밀번호는 8자 이상 20자 이하여야 합니다.");
      setIsResetError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetMessage("비밀번호가 일치하지 않습니다.");
      setIsResetError(true);
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (res.ok) {
        setResetMessage("비밀번호가 성공적으로 변경되었습니다.");
        setIsResetError(false);
        window.alert("비밀번호가 변경되었습니다. 다시 로그인하세요.");
        onClose();
      } else {
        setResetMessage("비밀번호 재설정에 실패했습니다.");
        setIsResetError(true);
      }
    } catch {
      setResetMessage("서버 오류가 발생했습니다.");
      setIsResetError(true);
    }
  };

  // Step 4: Replace rendering
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="auth-container">
          <h2>이메일 인증</h2>

          {!showCodeInput ? (
            <>
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={() => {}}
                className="auth-input"
                readOnly
              />
              <button className="auth-button" onClick={handleSendEmail}>
                인증하기
              </button>
              {sendMessage && (
                <p className="auth-message" style={{ color: isSendError ? "#d93025" : "#333" }}>
                  {sendMessage}
                </p>
              )}
            </>
          ) : !showResetForm ? (
            <>
              <input
                type="text"
                placeholder="인증번호 입력"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="auth-input"
              />
              <div className="auth-actions">
                <button className="auth-button secondary" onClick={handleResend}>
                  재전송
                </button>
                <button className="auth-button" onClick={handleVerify}>
                  인증하기
                </button>
              </div>
              {message && (
                <p className="auth-message" style={{ color: isError ? "#d93025" : "#333" }}>
                  {message}
                </p>
              )}
            </>
          ) : (
            <>
              <input
                type="password"
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
              />
              <button className="auth-button" onClick={handleResetPassword}>
                비밀번호 재설정
              </button>
              {resetMessage && (
                <p className="auth-message" style={{ color: isResetError ? "#d93025" : "#333" }}>
                  {resetMessage}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
