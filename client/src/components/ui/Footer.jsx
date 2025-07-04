import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>ⓒ 2025 [이스트캠프] AI 모델 개발자 과정 10기 2차 프로젝트 2조 | 박승주 , 신지웅 , 이하연 , 장진혁  </p>
        <div className="footer-links">
          <p>주요 통계사이트</p>
          <a href="https://kosis.kr" target="_blank" rel="noopener noreferrer">국가통계포털 (KOSIS)</a>

          <p>지리 기반 통계</p>
          <a href="https://sgis.kostat.go.kr" target="_blank" rel="noopener noreferrer">통계지리정보 (SGIS)</a>

          <p>마이크로데이터</p>
          <a href="https://mdis.kostat.go.kr" target="_blank" rel="noopener noreferrer">MDIS</a>

          <p>통계데이터센터</p>
          <a href="https://data.kostat.go.kr" target="_blank" rel="noopener noreferrer">데이터센터</a>

          <p>지표 모음</p>
          <a href="https://www.index.go.kr" target="_blank" rel="noopener noreferrer">지표누리</a>

          <p>조사 결과문서</p>
          <a href="#" target="_blank" rel="noopener noreferrer">보도자료 바로가기</a>

          <p>온라인간행물</p>
          <a href="#" target="_blank" rel="noopener noreferrer">온라인간행물 바로가기</a>

          <p>통계설명자료</p>
          <a href="#" target="_blank" rel="noopener noreferrer">통계설명 바로가기</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;