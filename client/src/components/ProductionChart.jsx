// 📁 src/components/ProductionChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

import "./ProductionChart.css"; // 스타일 파일 포함

// 샘플 테스트 데이터 (현재월: 2025-07 기준)
const data = [
  { date: "2025-04", actual: 112.3, predicted: 111.5 },
  { date: "2025-05", actual: 113.1, predicted: 112.0 },
  { date: "2025-06", actual: 114.0, predicted: 113.2 },
  { date: "2025-07", actual: 114.3, predicted: 114.3 },
  { date: "2025-08", predicted: 115.1 },
  { date: "2025-09", predicted: 116.3 },
  { date: "2025-10", predicted: 117.5 },
];

export default function ProductionChart() {
  const currentMonth = "2025-07";

  return (
    <div className="production-chart-container">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, bottom: 20, right: 10, left: 0 }}
          >
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[100, 120]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => value?.toFixed?.(1)} />

            {/* ✅ Legend 스타일 수정 */}
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                fontSize: "12px",
                color: "#4C9AFF",
                paddingBottom: "4px",
              }}
            />

            {/* 현재 월 세로 점선 */}
            <ReferenceLine x={currentMonth} stroke="red" strokeDasharray="4 2" />

            {/* 실제 데이터: 파란 실선 */}
            <Line
              type="monotone"
              dataKey="actual"
              name="실제 생산지수"
              stroke="#4C9AFF"
              strokeWidth={2}
              dot={false}
              connectNulls
            />

            {/* 예측 데이터: 파란 점선 */}
            <Line
              type="monotone"
              dataKey="predicted"
              name="예측 생산지수"
              stroke="#4C9AFF"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}