// src/services/api.js
import axios from 'axios';

// ✅ 기본 axios 인스턴스 설정
const api = axios.create({
  baseURL: 'http://localhost:5001/api',  // 백엔드 API 서버 주소
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ 요청마다 JWT 토큰 자동 삽입
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

// ✅ 공통 에러 처리 인터셉터
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

// -----------------------------
// 🔐 Auth API
// -----------------------------
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const verifyEmail = (token) => api.get(`/auth/verify?token=${token}`);

// -----------------------------
// 👤 User API
// -----------------------------
export const getMyInfo = () => api.get('/user/me');
export const savePreferences = (data) => api.post('/user/preferences', data);

// -----------------------------
// 📊 Data API
// -----------------------------
export const fetchProductionIndex = (region, industry) =>
  api.get(`/data/production?region=${region}&industry=${industry}`);

// -----------------------------
// 🔮 Prediction API
// -----------------------------
export const fetchPrediction = (region, industry) =>
  api.get(`/predict?region=${region}&industry=${industry}`);

// -----------------------------
// 🔔 Alert API
// -----------------------------
export const fetchAlerts = () => api.get('/alerts');
export const markAlertRead = (alertId) => api.post(`/alerts/${alertId}/read`);

// -----------------------------
// ⚙️ Admin API
// -----------------------------
export const postPredictionAdmin = (data) => api.post('/admin/predict', data);

export default api;