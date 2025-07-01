import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function FavoritesPage() {
  const favorites = [
    { id: 1, name: "서울특별시", code: "11" },
    { id: 2, name: "부산광역시", code: "26" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">내 즐겨찾기</h1>
        <Button variant="outline">PDF / CSV 다운로드</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item) => (
          <Card key={item.id} className="flex items-center justify-between">
            <CardContent className="flex flex-col space-y-1">
              <div className="text-lg font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">지역 코드: {item.code}</div>
            </CardContent>
            <Button variant="ghost" size="icon" aria-label="즐겨찾기 삭제">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}