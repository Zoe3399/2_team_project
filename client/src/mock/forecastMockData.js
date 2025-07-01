// 임시 데이터: 생산지수 예측 및 지역별 순위
// (주석) 추후 백엔드 연결 시 이 데이터는 삭제하거나 주석 처리해야 함

// 현재 날짜 기준: 2025년 6월 → 과거 3개월 & 미래 3개월 포함

export const forecastMockData = [
  { date: "2025-03", value: 106.2 },
  { date: "2025-04", value: 107.4 },
  { date: "2025-05", value: 109.1 },
  { date: "2025-06", value: 111.0 },
  { date: "2025-07", value: 112.3 },
  { date: "2025-08", value: 113.1 },
  { date: "2025-09", value: 114.2 }
];

export const topRegionsMock = [
  { name: "서울", index: 128.3 },
  { name: "부산", index: 123.1 },
  { name: "대구", index: 119.7 },
  { name: "인천", index: 117.5 },
  { name: "광주", index: 115.0 }
];