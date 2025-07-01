import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo"><strong>PowerMetric</strong></div>
      <nav>
        <Link to="/region">지역분석</Link>
        <Link to="/forecast">예측 보기</Link>
        <Link to="/download">다운로드</Link>
        <Link to="/mine">나의 분석</Link>
        <Link to="/faq">도움말 / FAQ</Link>
        <Link to="/login">로그인</Link>
        <Link to="/mypage" className="mypage">마이페이지</Link>
      </nav>
    </header>
  );
};

export default Header;