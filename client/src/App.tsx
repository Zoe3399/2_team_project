import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResetPw from './pages/ResetPw';
import RegionPage from './pages/RegionPage';
import RegionDetail from './pages/RegionDetail';
import Favorites from './pages/Favorites';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 */}
        <Route path="/" element={<Home />} />

        {/* 인증 */}
        <Route path="/reset" element={<ResetPw />} />

        {/* 분석 */}
        <Route path="/region" element={<RegionPage />} />
        <Route path="/region/:id" element={<RegionDetail />} />

        {/* 개인화 */}
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/terms" element={<Terms />} />

        {/* 예외 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;