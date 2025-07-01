import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl font-semibold mb-2">페이지를 찾을 수 없습니다.</p>
      <p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.</p>
      <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        메인으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
