import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // 모든 /api 요청을 Flask 백엔드(5000포트)로 프록시
    },
  },
  // 반드시 위 프록시 설정을 넣어야 프론트엔드에서 /api로 시작하는 모든 요청이
  // Vite dev 서버(5173)에서 Flask(5000) 백엔드로 정상적으로 전달됨. (404 방지)
  // 배포 시에는 이 옵션 제거(혹은 별도 프록시 서버 사용 가능)
});