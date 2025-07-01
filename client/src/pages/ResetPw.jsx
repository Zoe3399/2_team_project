import React, { useState } from 'react';

export default function ResetPw() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 비밀번호 재설정 API 연동 예정
    console.log('Reset Password Request:', email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 재설정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            재설정 링크 보내기
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          계정을 기억하셨나요?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            로그인하기
          </a>
        </div>
      </div>
    </div>
  );
}
