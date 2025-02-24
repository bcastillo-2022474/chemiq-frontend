import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RecoveryPage from './pages/RecoveryPage';
import Home from './pages/DashboardUserControll';
import Dashboard from './pages/DashboardStatsControll';
import NotFound from './components/NotFound404';
import UserPage from './pages/UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/dashboard/users" element={<Home />} />
        <Route path="/dashboard/stats" element={<Dashboard />} />
        <Route path="/userPage" element={<UserPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
