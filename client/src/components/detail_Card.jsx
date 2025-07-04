import React from 'react';
import './detail_Card.css';

const DetailCard = ({ title, value, unit, change, date, isPredicted = false, insight }) => {
  return (
    <div className="detail-card">
      <div className="detail-card-title">
        <h3>{title}</h3>
        {isPredicted && <span className="predicted-badge">예측값</span>}
      </div>
      <div className="detail-card-body">
        <p className="detail-card-value">
          {value}
          <span className="unit">{unit}</span>
        </p>
        <p className="detail-card-percentage centered-description highlight-change detail-card-change">
          전년대비 {change > 0 ? '▲' : change < 0 ? '▼' : '-'} {Math.abs(change)}%
        </p>
        {insight && (
          <p
            className="detail-card-insight indented-textm centered-text"
            dangerouslySetInnerHTML={{ __html: insight }}
          />
        )}
        <p className="detail-card-date">{date} 기준</p>
      </div>
    </div>
  );
};


export default DetailCard;

// 전력 사용량 카드 예시
export const ElectricityUsageCard = () => (
  <DetailCard
    title="전력 사용량"
    value={12345}
    unit="MWh"
    change={2.3}
    date="2025.04"
    isPredicted={false}
    insight="최근 12개월 국내전력량은<br>지속적인 증가세를 보이고 있습니다."
  />
);

// 수출액 카드 예시
export const ExportAmountCard = () => (
  <DetailCard
    title="수출액"
    value={6789}
    unit="억원"
    change={-1.7}
    date="2025.04"
    isPredicted={false}
    insight="최근 수출액은 1.7% 감소했으며<br>글로벌 수요 둔화의 <br>영향을 받고 있습니다."
  />
);

// 생산지수 카드 예시
export const ProductionIndexCard = () => (
  <DetailCard
    title="생산지수"
    value={102.4}
    unit=""
    change={1.2}
    date="2025.04"
    isPredicted={false}
    insight="생산지수는 전년대비<br>1.2% 증가하며<br>회복세를 이어가고 있습니다."
  />
);

// 가로로 3개 카드 렌더링하는 컴포넌트
export const InsightCards = () => (
  <div className="detail-card-vertical-container">
    <ProductionIndexCard />
    <ElectricityUsageCard />
    <ExportAmountCard />
  </div>
);