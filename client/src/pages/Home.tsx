// 필수 라이브러리 및 주요 컴포넌트 불러오기
import React, { useEffect, useState } from "react";
import type { FC } from "react";

// 주요 컴포넌트
import Banner from "../components/Banner";
import Card from "../components/ui/Card";
import ProductionChart from "../components/ProductionChart";

const Home: FC = () => {
  const [topRegions, setTopRegions] = useState<{ name: string; index: number }[]>([]);

  useEffect(() => {
    // 실제 API에서 지역별 TOP 5 데이터 불러오기
    const fetchTopRegions = async () => {
      try {
        // 실제 API 엔드포인트로 요청
        const response = await fetch("/api/region/top");
        const data = await response.json();
        setTopRegions(data);
      } catch (error) {
        // 에러 발생 시 콘솔에 출력
        console.error("지역 데이터 불러오기 실패:", error);
      }
    };

    fetchTopRegions();
  }, []);

  return (
    <>
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
};

export default Home;