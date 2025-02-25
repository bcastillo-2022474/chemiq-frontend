import { Sidebar } from "@/components/Sidebar";
import { FeaturedPodcast } from "@/components/FeaturedPodcast";
import { FeaturedNews } from "@/components/FeaturedNews";
import { FeaturedProject } from "@/components/FeaturedProject";

export default function UserPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-background text-text">
        <div className="max-w-6xl mx-auto">
          <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
            <img
              src="/public/banner.jpg"
              alt="Química Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background to-transparent" style={{backdropFilter: "blur(2px)"}} />
            <h1 className="absolute bottom-12 left-8 text-5xl font-bold text-accent animate-fade-in">
              Bienvenido a la Asociación de Química
            </h1>
          </div>
          <div className="flex flex-col space-y-8">
            <FeaturedPodcast />
            <FeaturedNews />
            <FeaturedProject />
          </div>
        </div>
      </main>
    </div>
  );
}