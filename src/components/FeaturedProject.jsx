import { Card, CardContent } from "@/components/ui/card";
import { Beaker, Users, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedProject() {
  return (
    <Link to="/proyectos/materiales-biodegradables">
      <Card className="bg-surface text-text hover:shadow-2xl transition-all duration-300 transform hover:scale-102 cursor-pointer overflow-hidden group">
        <div className="flex h-64">
          <div className="w-1/2 relative">
            <img
              src="/public/project.jpg"
              alt="Materiales biodegradables"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </div>
          <CardContent className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Beaker className="h-6 w-6 mr-2 text-accent" />
                <h3 className="text-2xl font-bold text-accent">
                  Materiales Biodegradables
                </h3>
              </div>
              <p className="text-text-muted mb-4">
                Desarrollando polímeros ecológicos para combatir la contaminación
                por plásticos.
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="flex flex-col items-center p-2 bg-background rounded-lg">
                  <Target className="h-4 w-4 text-primary mb-1" />
                  <span className="text-xs font-medium text-text-muted">
                    Reducir plásticos
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg">
                  <Users className="h-4 w-4 text-secondary mb-1" />
                  <span className="text-xs font-medium text-text-muted">
                    12 miembros
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg">
                  <Zap className="h-4 w-4 text-accent mb-1" />
                  <span className="text-xs font-medium text-text-muted">
                    75% completado
                  </span>
                </div>
              </div>
              <div className="bg-background flex items-center bg-accent text-background px-3 py-1 rounded-full group-hover:bg-accent transition-colors duration-300">
                <span className="text-sm font-medium">Unirse al proyecto</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}