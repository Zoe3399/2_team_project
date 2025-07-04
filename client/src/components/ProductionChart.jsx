import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from "recharts";
import "./ProductionChart.css";

// X축 라벨 월 변환용
function formatMonth(str) {
  if (!str) return "";
  // "2025-01-01" -> "2025-01"
  return str.slice(0, 7);
}

export default function ProductionChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastActualDate, setLastActualDate] = useState(""); // 2025-04
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const dummyData = [
      { date: "2025-01", actual: 100.2, predicted: 100.7 },
      { date: "2025-02", actual: 104.6, predicted: 105.0 },
      { date: "2025-03", actual: 116.3, predicted: 116.8 },
      { date: "2025-04", actual: 116.6, predicted: 117.0 },
      { date: "2025-05", actual: null, predicted: 112.4 },
      { date: "2025-06", actual: null, predicted: 105.1 },
      { date: "2025-07", actual: null, predicted: 98.8 },
    ];

    setData(dummyData);
    setLastActualDate("2025-04");
    const lastDate = dummyData.find(d => d.actual === null)?.date || "2025-05";
    const [year, month] = "2025-04".split("-");
    const nextMonth = Number(lastDate.split("-")[1]);
    setInfoMessage(`${year}년 ${Number(month)}월 까지의 값만 제공됩니다. ${nextMonth}월 이후 값은 AI 기반 예측결과이며, 추세 흐름을 참고하시기 바랍니다.`);
    setLoading(false);
  }, []);

  if (loading) return <div>데이터 로딩 중...</div>;
  if (!data.length) return <div>데이터가 없습니다.</div>;

  return (
    <div className="production-chart-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ fontSize: "14px", color: "#666" }}>단위: 지수 (기준=100)</div>
        <div style={{ fontSize: "14px", color: "#444" }}>예측 정확도 (R²): 약 0.63 → 실제 변동의 63% 설명</div>
      </div>
      <div style={{ fontSize: "14px", marginBottom: "8px", color: "#666" }}>{infoMessage}</div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, bottom: 20, right: 10, left: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 14 }}
              interval={0}
              tickFormatter={v => {
                if (!v || !v.includes("-")) return "";
                const [y, m] = v.split("-");
                return `${y}년 ${Number(m)}월`;
              }}
            />
            <YAxis domain={[90, 130]} tick={{ fontSize: 14 }} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "실제 생산지수") return [`${value}`, "실제 생산지수"];
                if (name === "예측 생산지수") return [`${value} (예측)`, "예측 생산지수"];
                return value;
              }}
              labelFormatter={v => {
                if (!v || !v.includes("-")) return "";
                const [y, m] = v.split("-");
                return `${y}년 ${Number(m)}월`;
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: "16px", paddingBottom: "4px" }}
            />
            {/* 4월 ReferenceLine */}
            {lastActualDate && (
              <ReferenceLine
                x={lastActualDate}
                stroke="red"
                strokeDasharray="4 2"
                label={{
                  position: 'top',
                  value: '최종 실제값',
                  fill: 'red',
                  fontSize: 14
                }}
              />
            )}
            {/* 실제 생산지수 (1~4월만) */}
            <Line
                type="monotone"
                dataKey="actual"
                name="실제 생산지수"
                stroke="#4C9AFF"
                strokeWidth={2}
                dot={{ r: 3, fill: "#4C9AFF" }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="예측 생산지수"
                stroke="#FF8800"
                strokeDasharray="5 5"
                strokeWidth={2}
                strokeOpacity={0.6}
                dot={{ r: 4, stroke: "#FF8800", fill: "#fff" }}
              />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}