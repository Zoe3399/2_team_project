import React from 'react';
import './download.css';

const Download = () => {
  return (
    <div className="download-container">
      <aside className="download-sidebar">
        <ul>
          <li>식량작물 생산량</li>
          <li>어업생산량</li>
          <li>온라인쇼핑몰 거래액</li>
          <li>제조업 사업체수</li>
          <li className="active">제조업 생산성능력 및 가동률지수</li>
          <li>제조업생산지수</li>
        </ul>
        <div className="category-select">환경: 에너지 ▽</div>
      </aside>
      <main className="download-main">
        <h1>제조업 생산능력 및 가동률지수</h1>
        <section className="chart-section">
          <div className="chart-placeholder">[차트 이미지]</div>
          <div className="source-text">출처: 통계청, 광업제조업동향조사, 「제조업 평균가동률」</div>
        </section>

        <section className="summary-section">
          <h2>100대 지표 내 연관지표</h2>
          <div className="cards">
            <div className="card">
              <div className="card-img">[이미지]</div>
              <div className="card-title">제조업 사업체수</div>
              <div className="card-value">73,260</div>
              <div className="card-desc">2022 기준, 2021 대비 750 ↑</div>
            </div>
            <div className="card">
              <div className="card-img">[이미지]</div>
              <div className="card-title">제조업생산지수</div>
              <div className="card-value">114.1</div>
              <div className="card-desc">2025.05 기준, 2024.05 대비 0.2 ↑</div>
            </div>
            <div className="card">
              <div className="card-img">[이미지]</div>
              <div className="card-title">전력 사용량</div>
              <div className="card-value">1,250 MWh</div>
              <div className="card-desc">2025.05 기준, 2024.05 대비 1.7% ↑</div>
            </div>
          </div>
        </section>

        <section className="table-section">
          <h2>통계표</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>년도</th>
                <th>생산능력지수</th>
                <th>가동률지수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023</td>
                <td>102.5</td>
                <td>78.2</td>
              </tr>
              <tr>
                <td>2024</td>
                <td>105.1</td>
                <td>80.3</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="line-chart-section">
          <h2>연관지표 차트</h2>
          <div className="line-chart-placeholder">[라인 차트 이미지]</div>
        </section>
      </main>
    </div>
  );
};

export default Download;