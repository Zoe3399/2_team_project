// React 기본 및 컴포넌트 임포트
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Banner from "@/components/Banner"; // 배너 컴포넌트
import Card from "@/components/ui/Card";
import ProductionChart from "@/components/ProductionChart"; // 예측 차트 컴포넌트
import KoreaMap3D from "@/components/KoreaMap3D";
import "@/components/KoreaMap3D.css";

// 추후 API 연동 시 사용될 import (현재는 mock 사용)
// import { fetchTopRegions } from "@/services/api";
import { topRegionsMock } from "@/mock/forecastMockData";

export default function Home() {
  const [topRegions, setTopRegions] = useState([]);

  useEffect(() => {
    // 실제 API 연동 시 사용
    // fetchTopRegions().then(setTopRegions);
    setTopRegions(topRegionsMock);
  }, []);

  return (
    <>
      {/* 상단 헤더 */}
      <Header />

      {/* 배너 영역 */}
      <section className="title-section">
        <Banner />
      </section>

      {/* 본문 카드 영역 */}
      <section className="section p-6 space-y-8 max-w-5xl mx-auto">
        {/* 카드 1: 생산지수 예측 그래프 */}
        <Card
          title="생산지수 추이 모션 그래프"
          description={
            <>
              AI 예측 모델을 활용하여 산업 생산지수 추이를 미리 분석하고
              <br />
              다양한 경제지표 및 전력 소비 패턴과 결합하여
              <br />
              산업 흐름의 방향성을 확인합니다.
            </>
          }
          detail="예측 결과 기반 전략 수립을 위한 인사이트 제공"
          buttonText="자세히 보기 →"
          link="/forecast"
          graphContent={<ProductionChart />} // 차트 컴포넌트만 삽입
        />

         {/* 카드 2: 지역 순위 */}
        <Card
          title="지역 순위 TOP 5"
          description={
            <>
              AI 예측 모델을 통해 산업 생산지수의 변화를 시각화하고,
              <br />
              전력 소비 패턴과 주요 경제 지표를 함께 보여줍니다.
              <br />
              이를 통해 산업 흐름의 전반적인 방향을 쉽게 파악할 수 있습니다
            </>
          }
          detail="지역 특화 산업/정책 수립 지원용 분석 리포트 제공"
          buttonText="자세히 보기 →"
          link="/region"
          graphContent={
            <KoreaMap3D 
              regionData={topRegions.slice(0, 5).map((reg, idx) => ({
                name: reg.name,
                score: reg.index,
                color: idx === 0 ? 0xffd700 : idx === 1 ? 0xc0c0c0 : idx === 2 ? 0xcd7f32 : 0xff6b6b
              }))}
              onRegionClick={(regionName) => {
                const element = document.querySelector(`[data-region-name="${regionName}"]`);
                if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          }
        />
      </section>
    </>
  );
}