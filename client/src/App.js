import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RegionPage from './pages/RegionPage';
import RegionDetail from './pages/RegionDetail';
import Favorites from './pages/Favorites';
import ResetPw from './pages/ResetPw';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset" element={<ResetPw />} />
        <Route path="/region" element={<RegionPage />} />
        <Route path="/detail/:regionId" element={<RegionDetail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;