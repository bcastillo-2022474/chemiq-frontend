import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RecoveryPage from './pages/RecoveryPage';
import Home from './pages/DashboardUserControll';
import Dashboard from './pages/DashboardStatsControll';
import Reset from './pages/Reset';
import NotFound from './components/NotFound404';
<<<<<<< HEAD
import UserPage from './pages/UserPage';
=======
import { Projects } from './pages/DashboardProjectsControll';
>>>>>>> 9bc055f2aea5352733b96feb59f8eed1986ccb17

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/dashboard/users" element={<Home />} />
        <Route path="/dashboard/stats" element={<Dashboard />} />
<<<<<<< HEAD
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/reset" element={<Reset />} />
=======
        <Route path="/dashboard/projects" element={<Projects />} />
>>>>>>> 9bc055f2aea5352733b96feb59f8eed1986ccb17
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

