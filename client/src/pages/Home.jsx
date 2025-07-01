import React from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";

// (주석) 나중에 백엔드 연결 시 사용
// import { fetchForecastData } from "@/services/api";
// import { useEffect, useState } from "react";

// (주석) 임시 데이터 코드로 나중에 백엔드 연결할때 없애거나 주석 필요
const forecastMockData = [
  { date: "2024-01", value: 105 },
  { date: "2024-02", value: 107 },
  { date: "2024-03", value: 110 },
  { date: "2024-04", value: 108 },
  { date: "2024-05", value: 112 },
];

const topRegionsMock = [
  { name: "서울", index: 128.3 },
  { name: "부산", index: 123.1 },
  { name: "대구", index: 119.7 },
  { name: "인천", index: 117.5 },
  { name: "광주", index: 115.0 },
];

const Home = () => {
  return (
    <>
      <Header />
      <section className="title-section">
        <h1>
          여기는 배너가 들어갈 예정입니다.
          <br />
          글자 or 사진
        </h1>
      </section>

      <section className="section">
        <Card
          title="생산지수 추이 모션 그래프"
          description={
            <>
              AI 예측 모델을 활용하여 산업 생산지수 추이를 미리 분석하고<br />
              다양한 경제지표 및 전력 소비 패턴과 결합하여<br />
              산업 흐름의 방향성을 확인합니다.
            </>
          }
          detail="예측 결과 기반 전략 수립을 위한 인사이트 제공"
          buttonText="자세히 보기 →"
          link="/forecast"
          graphContent={
            <div style={{ width: "100%", height: "100%" }}>
              <h3>예측 그래프</h3>
              <ul>
                {forecastMockData.map((d, i) => (
                  <li key={i}>{d.date}: {d.value}</li>
                ))}
              </ul>
            </div>
          }
        />

        <Card
          title="지역 순위 TOP 5 그래프"
          description={
            <>
              지역별 전력 사용량 기반으로 산업별 비중과 생산성을 분석합니다.<br />
              과거 데이터를 토대로 지역경제 흐름을 파악하고<br />
              고효율 산업군 발굴에 활용할 수 있습니다.
            </>
          }
          detail="지역 특화 산업/정책 수립 지원용 분석 리포트 제공"
          buttonText="자세히 보기 →"
          link="/region"
          graphContent={
            <div style={{ width: "100%", height: "100%" }}>
              <h3>지역 순위 TOP 5</h3>
              <ol>
                {topRegionsMock.map((region, i) => (
                  <li key={i}>{region.name}: {region.index}</li>
                ))}
              </ol>
            </div>
          }
        />
      </section>
    </>
  );
};

export default Home;