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

import { useEffect, useState } from "react";

import "./ProductionChart.css"; // 스타일 파일 포함

export default function ProductionChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    // 백엔드 API에서 실제 + 예측 생산지수 데이터 불러오기
    fetch("http://localhost:5001/api/production/summary")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
        if (result.data?.length) {
          setCurrentMonth(result.data.find(d => d.actual !== undefined)?.date || "");
        }
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>데이터 로딩 중...</div>;

  return (
    <div className="production-chart-container">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, bottom: 20, right: 10, left: 0 }}
          >
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => value?.toFixed?.(1)} />

            {/* Legend 스타일 수정 */}
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