import { Card, CardContent } from "@/components/ui/card";
import { Podcast, Play, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedPodcast() {
  return (
    <Link to="/podcast/ultimo-episodio">
      <Card className="bg-surface text-text hover:shadow-2xl transition-all duration-300 transform hover:scale-102 cursor-pointer overflow-hidden group">
        <div className="flex h-64">
          <div className="w-1/2 relative">
            <img
              src="/public/podcast.jpg"
              alt="Laboratorio de química"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </div>
          <CardContent className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Podcast className="h-6 w-6 mr-2 text-primary" />
                <h3 className="text-2xl font-bold text-primary">
                  Avances en Química Verde
                </h3>
              </div>
              <p className="text-text-muted mb-4">
                Explorando innovaciones sostenibles en la industria química
                moderna.
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-text-muted">
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-4">45 min</span>
                <Users className="h-4 w-4 mr-1" />
                <span>10k oyentes</span>
              </div>
              <div className="flex items-center bg-primary text-background px-3 py-1 rounded-full group-hover:bg-accent transition-colors duration-300">
                <Play className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Reproducir</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}