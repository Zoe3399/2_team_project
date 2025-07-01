import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = false; // TODO: 전역 상태 또는 Context 연동 예정

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-10">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          제조업 예측 서비스
        </div>
        <div className="flex gap-4 items-center">
          {isLoggedIn && (
            <button onClick={() => navigate('/favorites')} className="text-sm text-blue-700 hover:underline">
              내 즐겨찾기
            </button>
          )}
          {isLoggedIn ? (
            <>
              <button className="text-sm text-gray-600 hover:underline">내 정보</button>
              <button className="text-sm text-red-500 hover:underline">로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:underline">
                로그인
              </button>
              <button onClick={() => navigate('/signup')} className="text-sm text-blue-600 hover:underline">
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-5xl mx-auto py-12 px-6 space-y-10">
        {/* 생산지수 요약 */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">📌 제조업 생산지수 요약</h2>
          <p>🗓️ 2024년 6월 생산지수: <strong>105.7 (지수)</strong></p>
          <p>🔼 전월 대비 변화: <strong>+2.4 (지수)</strong></p>
        </section>

        {/* 인사이트 메시지 */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">💡 주요 인사이트</h2>
          <p>6월 생산지수, 전력사용량 증가로 상승세 유지</p>
        </section>

        {/* 버튼 영역 */}
        <section className="flex justify-center gap-6">
          <button
            onClick={() => navigate('/industry')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            업종별 분석
          </button>
          <button
            onClick={() => navigate('/region')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            지역별 분석
          </button>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="text-center py-6 text-sm text-gray-500 bg-white border-t">
        ⓒ 2025 제조업 예측 서비스. 모든 권리 보유.
      </footer>
    </div>
  );
}