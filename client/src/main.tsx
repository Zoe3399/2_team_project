import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css'; // or index.css 존재하는 걸로 수정

import App from './App'; // 확장자 생략 (ts/tsx 자동 인식)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);