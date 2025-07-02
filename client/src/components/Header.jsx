// Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // 페이지 이동을 위한 Link 컴포넌트
import "./Header.css"; // 헤더에 적용되는 스타일 시트
import LoginModal from "@/components/LoginModal"; // 로그인 모달 컴포넌트
import SignupModal from "@/components/SignupModal"; // 회원가입 모달 컴포넌트

// 헤더 컴포넌트 정의
const Header = () => {
  // 로그인 모달의 상태 (열림/닫힘)
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // 회원가입 모달의 상태 (열림/닫힘)
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <header className="header">
      {/* 사이트 로고 */}
      <div
        className="logo"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '22px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          color: '#1e90ff',
          marginRight: '24px'
        }}
      >
        PowerMetric
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="nav-bar">
        <div className="nav-left">
          <Link to="/region">지역분석</Link>
          <Link to="/forecast">예측 보기</Link>
          <Link to="/download">다운로드</Link>
          <Link to="/mine">나의 분석</Link>
          <Link to="/faq">도움말 / FAQ</Link>
        </div>
        <div className="nav-right">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsLoginOpen(true); }}
            className="nav-button"
          >로그인</a>
          <span style={{ margin: '0 6px', color: '#ccc' }}>|</span>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsSignupOpen(true); }}
            className="nav-button"
          >회원가입</a>
          <Link to="/mypage" className="mypage">마이페이지</Link>
        </div>
      </nav>

      {/* 로그인 모달: isLoginOpen이 true일 때만 렌더링 */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          setShowSignup={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }}
        />
      )}

      {/* 회원가입 모달: isSignupOpen이 true일 때만 렌더링 */}
      {isSignupOpen && (
        <SignupModal
          onClose={() => setIsSignupOpen(false)}
          setShowLogin={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
    </header>
  );
};

export default Header;