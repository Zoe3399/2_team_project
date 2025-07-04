// src/services/api.js
import axios from 'axios';

// 기본 axios 인스턴스 설정
const api = axios.create({
  baseURL: 'http://localhost:5001/api',  // 백엔드 API 서버 주소 (수정: 포트 5001로 직접 지정)
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청마다 JWT 토큰 자동 삽입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 공통 에러 처리 인터셉터
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
    } else if (status === 403) {
      alert('접근 권한이 없습니다.');
    } else if (status >= 500) {
      alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    return Promise.reject(err);
  }
);


// 카카오 로그인 API 호출 함수
export async function kakaoLogin(socialId, name) {
  const response = await api.post('/auth/kakao', { social_id: socialId, name });
  return response.data;
}

// 이메일 회원가입 API
export async function register({ email, password }) {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
}

// 이메일 인증 API
export async function verifyEmail({ email, code }) {
  const response = await api.post('/auth/verify-email', { email, code });
  return response.data;
}

// 비밀번호 재설정 토큰 요청
export async function requestPasswordReset(email) {
  const response = await api.post('/auth/password-reset', { email });
  return response.data;
}

// 비밀번호 재설정
export async function resetPassword({ token, new_password }) {
  const response = await api.post('/api/auth/password-reset', { token, new_password });
  return response.data;
}

// 인증 코드 재전송
export async function resendCode(email) {
  const response = await api.post('/auth/resend-code', { email });
  return response.data;
}

// 뉴스 전체 조회
export async function fetchNewsAll() {
  const response = await api.get('/news/all');
  return response.data;
}

// 기본 axios 인스턴스 내보내기
export default api;
