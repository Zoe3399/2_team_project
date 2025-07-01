// React 기본 및 컴포넌트 임포트
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Banner from "@/components/Banner"; // 배너 컴포넌트
import Card from "@/components/ui/Card";
import ProductionChart from "@/components/ProductionChart"; // 예측 차트 컴포넌트

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
          graphContent={<ProductionChart />} // ✅ 차트 컴포넌트만 삽입
        />

        {/* 카드 2: 지역 순위 */}
        <Card
          title="지역 순위 TOP 5 그래프"
          description={
            <>
              지역별 전력 사용량 기반으로 산업별 비중과 생산성을 분석합니다.
              <br />
              과거 데이터를 토대로 지역경제 흐름을 파악하고
              <br />
              고효율 산업군 발굴에 활용할 수 있습니다.
            </>
          }
          detail="지역 특화 산업/정책 수립 지원용 분석 리포트 제공"
          buttonText="자세히 보기 →"
          link="/region"
          graphContent={
            <div className="flex flex-col items-start space-y-1 text-base font-medium text-gray-700">
              {topRegions.slice(0, 5).map((reg, idx) => (
                <div key={idx}>
                  {idx + 1}위: {reg.name} | {reg.index}
                </div>
              ))}
            </div>
          }
        />
      </section>
    </>
  );
}