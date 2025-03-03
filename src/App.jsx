import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RecoveryPage from './pages/RecoveryPage';
import Home from './pages/DashboardUserControll';
import Dashboard from './pages/DashboardStatsControll';
import Reset from './pages/Reset';
import NotFound from './components/NotFound404';
import JuntaPage from './pages/JuntaPage';
import UserPage from './pages/UserPage';
import { Projects } from './pages/DashboardProjectsControll';


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
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/reset" element={<Reset />} />

        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

