import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.js';
import LoginPage from './pages/LoginPage.js';
import RecoveryPage from './pages/RecoveryPage.js';
import Home from './pages/DashboardUserControll.js';
import Dashboard from './pages/DashboardStatsControll.js';
import Reset from './pages/Reset.js';
import NotFound from './components/NotFound404.js';
import JuntaPage from './pages/JuntaPage.js';
import { UserRoutes } from './pages/UserPage.js';
import { Projects } from './pages/DashboardProjectsControll.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/dashboard/users" element={<Home />} />
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard/stats" element={<Dashboard />} />
        <Route path="/juntapage" element={<JuntaPage/>}/>
        <Route path="/portal/*" element={<UserRoutes />} />
        <Route path="/reset" element={<Reset />} />

        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

