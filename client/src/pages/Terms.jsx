import React, { useState } from 'react';

const Terms = () => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const allAgreed = agreeTerms && agreePrivacy;

  const handleAllAgree = (e) => {
    const checked = e.target.checked;
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">이용약관 및 개인정보 처리방침</h1>

      <div className="mb-4">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={agreeTerms && agreePrivacy}
            onChange={handleAllAgree}
          />
          <span>전체 동의</span>
        </label>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📜 홈페이지 이용약관</h2>
        <div className="border p-4 h-48 overflow-y-scroll bg-white rounded shadow text-sm">
          <p className="mb-2">제1조 (목적)...</p>
          <p className="mb-2">제2조 (이용계약의 성립)...</p>
          <p className="mb-2">제3조 (회원의 의무)...</p>
          <p className="mb-2">제4조 (서비스의 제공 및 변경)...</p>
        </div>
        <label className="inline-flex items-center mt-2 space-x-2">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <span>홈페이지 이용약관에 동의합니다.</span>
        </label>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📜 개인정보 수집 및 이용 동의</h2>
        <div className="border p-4 h-48 overflow-y-scroll bg-white rounded shadow text-sm">
          <p className="mb-2">수집 항목: 이메일, 이름, 비밀번호</p>
          <p className="mb-2">수집 목적: 회원 식별, 맞춤형 서비스 제공</p>
          <p className="mb-2">보유 기간: 회원 탈퇴 후 1년간 보관, 이후 자동 파기</p>
          <p className="mb-2">동의 거부 시: 서비스 이용이 제한될 수 있음</p>
        </div>
        <label className="inline-flex items-center mt-2 space-x-2">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
          />
          <span>개인정보 수집 및 이용에 동의합니다.</span>
        </label>
      </section>

      <button
        disabled={!allAgreed}
        className={`w-full py-2 mt-4 rounded text-white ${allAgreed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        onClick={() => alert('회원가입 계속 진행')}
      >
        다음 페이지
      </button>
    </div>
  );
};

export default Terms;