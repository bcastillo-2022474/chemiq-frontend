import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FeaturedPodcast } from "@/components/FeaturedPodcast";
import { FeaturedNews } from "@/components/FeaturedNews";
import { FeaturedProject } from "@/components/FeaturedProject";
import NewsSection from "@/components/NewsSection"

export default function UserPage() {
  const [selectedComponent, setSelectedComponent] = useState("home");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "home":
        return (
          <>
            <div className="relative h-80 mb-8 rounded-xl overflow-hidden">
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
            <FeaturedNews />
            <FeaturedProject />
            <FeaturedPodcast />
          </>
        );
      case "podcast":
        return <FeaturedPodcast />;
      case "news":
        return <NewsSection />;
      case "project":
        return <FeaturedProject />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSelect={setSelectedComponent} />
      <main className="flex-1 p-8 overflow-auto bg-background text-text">
        <div className="max-w-6xl mx-auto">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}