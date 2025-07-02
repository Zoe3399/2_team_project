import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Header
          openLoginModal={() => setShowLogin(true)}
          openSignupModal={() => setShowSignup(true)}
        />
        <Routes>
          {/* 메인 */}
          <Route path="/" element={<Home />} />
          {/* 예외 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            setShowSignup={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
          />
        )}
        {showSignup && (
          <SignupModal
            onClose={() => setShowSignup(false)}
            setShowLogin={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;