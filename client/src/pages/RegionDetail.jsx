import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const dummyData = [
  { date: "2024-01", actual: 101.2, predicted: 100.9 },
  { date: "2024-02", actual: 103.1, predicted: 102.8 },
  { date: "2024-03", actual: 104.5, predicted: 104.0 },
];

export default function RegionDetail() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-xl font-bold">예측 상세 - 서울</div>

      <Card>
        <CardContent className="space-y-2">
          <div className="text-lg">2025년 7월 예측 생산지수: <span className="font-semibold">104.3</span> (신뢰도: 87%)</div>
          <div className="text-sm text-gray-500">전력 사용량 증가에 따라 상승세 유지 예상</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="font-medium mb-2">📈 실제값 vs 예측값</div>
          <LineChart width={600} height={300} data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#8884d8" name="실제값" />
            <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="예측값" />
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="font-medium mb-2">📊 전력 사용량 / 수출 금액 추이</div>
          {/* 추후 별도 차트 추가 가능 */}
          <div className="text-sm text-gray-400">* 상세 지표 분석 차트는 추후 연결 예정</div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline">← 목록으로</Button>
        <Button variant="default">★ 즐겨찾기 추가</Button>
        <Button variant="secondary">PDF/CSV 다운로드</Button>
      </div>
    </div>
  );
}
