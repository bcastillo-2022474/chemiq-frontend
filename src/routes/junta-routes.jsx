import { useAuth } from "@/context/auth.jsx";
import { NotEnoughPermissions } from "@/components/NotEnoughPermissions.jsx";
import { Outlet } from "react-router-dom";


export function JuntaRoutes() {
  const { loading, user } = useAuth();

  if (loading) return;
  const isAuthenticated = user.rol === "Admin" || user.rol === "Junta";

  if (!isAuthenticated) return <NotEnoughPermissions/>;

  return <Outlet/>
}