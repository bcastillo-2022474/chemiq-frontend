import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "@/context/auth";
import { NoAuth } from "@/routes/no-auth";
import { Auth } from "@/routes/auth";
import NotFound from "@/components/NotFound404";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RecoveryPage from "@/pages/RecoveryPage";
import Reset from "@/pages/Reset";
import Home from '@/pages/DashboardUserControll';
import Stats from '@/pages/DashboardStatsControll';
import JuntaPage from '@/pages/JuntaPage';
import { PortalRoutes } from '@/pages/UserPage';
import { JuntaRoutes } from "@/routes/junta-routes";
import { Dashboard } from "@/pages/Dashboard";
import Podcast from './pages/DashboardPodcastControll';
import NewsHome from './pages/DashboardNewsControll';
import { ProjectDetailsPage } from "@/pages/admin/projects/id/ProjectDetailPage.dashboard.jsx";
import { Projects } from "@/pages/admin/projects/ProjectsPage.dashboard.jsx";


function App() {
  return (
    <Router>
      <RoutesWrapper/>
    </Router>
  );
}

function RoutesWrapper() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<GeneralRoutes/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </AuthProvider>
    </>
  )
}

function GeneralRoutes() {
  return (
    <Routes>
      {/*NO AUTH PAGES*/}
      <Route path="" element={<NoAuth/>}>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/recovery" element={<RecoveryPage/>}/>
        <Route path="/reset-password/:token" element={<Reset/>}/>
      </Route>
      <Route path="" element={<Auth/>}>
        <Route path="/juntapage" element={<JuntaPage/>}/>
        <Route path="/portal/*" element={<PortalRoutes/>}/>
        <Route path="/dashboard" element={<Navigate to="/dashboard/stats"/>}/>

        {/* @TODO: here goes the protected routes */}
        <Route path="" element={<JuntaRoutes/>}>
          <Route path="/dashboard" element={<Dashboard/>}>
            <Route path="projects" element={<Projects/>}>
              <Route path=":projectId" element={<ProjectDetailsPage/>}/>
            </Route>
            <Route path="stats" element={<Stats/>}/>
            <Route path="users" element={<Home/>}/>
            <Route path="podcast" element={<Podcast/>}/>
            <Route path="news" element={<NewsHome/>}/>
          </Route>
        </Route>
        {/*<UserRoutes/>*/}
        {/*<JuntaRoutes/>*/}
      </Route>
    </Routes>
  )
}

export default App;

