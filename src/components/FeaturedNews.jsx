import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, ArrowRight, Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedNews() {
  return (
    <Link to="/noticias/descubrimiento-catalizador">
      <Card className="bg-surface text-text hover:shadow-2xl transition-all duration-300 transform hover:scale-102 cursor-pointer overflow-hidden group">
        <div className="flex h-64">
          <div className="w-1/2 relative">
            <img
              src="/public/news.jpg"
              alt="Descubrimiento de catalizador"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </div>
          <CardContent className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Newspaper className="h-6 w-6 mr-2 text-secondary" />
                <h3 className="text-2xl font-bold text-secondary">
                  Revolución en Catálisis
                </h3>
              </div>
              <p className="text-text-muted mb-4">
                Nuevo catalizador promete transformar procesos químicos clave en
                la industria.
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-text-muted">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">Publicado hoy</span>
                <Eye className="h-4 w-4 mr-1" />
                <span>5k vistas</span>
              </div>
              <div className="flex items-center bg-secondary text-background px-3 py-1 rounded-full group-hover:bg-accent transition-colors duration-300">
                <span className="text-sm font-medium mr-1">Leer más</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}