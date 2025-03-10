import { Sidebar } from "@/components/Sidebar"
import { FeaturedPodcast } from "@/components/FeaturedPodcast"
import { FeaturedNews } from "@/components/FeaturedNews"
import { FeaturedProject } from "@/components/FeaturedProject"
import { NewsRoutes } from "@/components/NewsSection"
import { YouTubeVideos } from "@/components/YouTubeVideos"
import { ProjectsSection } from "@/components/ProjectsSection"
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";

function UserPage() {
  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar/>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet/>
        </div>
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <>
      <header className="relative h-48 mb-12 rounded-xl overflow-hidden bg-[#28BC98]">
        <div className="absolute inset-0">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#header-gradient)"/>
            <defs>
              <linearGradient id="header-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7DE2A6"/>
                <stop offset="100%" stopColor="#28BC98"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-5xl font-light text-center tracking-tight text-[#0B2F33]">
            <span className="font-bold">Asociación de Química</span>
          </h1>
          <p className="mt-2 text-center text-lg text-[#0B2F33]/80">Novedades: Noticias, proyectos y podcasts más
            recientes</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl overflow-hidden border border-[#7DE2A6]/20">
          <FeaturedNews/>
        </div>
        <div className="bg-white rounded-xl overflow-hidden border border-[#7DE2A6]/20">
          <FeaturedProject/>
        </div>
        <div className="bg-white rounded-xl overflow-hidden border border-[#7DE2A6]/20">
          <FeaturedPodcast/>
        </div>
      </div>
    </>
  )
}

export function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserPage/>}>
        <Route index element={<HomePage/>}/>
        <Route path="podcast" element={<YouTubeVideos/>}/>
        <Route path="news/*" element={<NewsRoutes/>}/>
        <Route path="project" element={<ProjectsSection/>}/>
      </Route>
    </Routes>
  )
}
