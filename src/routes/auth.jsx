import { useAuth } from "@/context/auth";
import { Navigate, Outlet } from "react-router-dom";

export function Auth() {
  const { authenticated, loading, refreshing } = useAuth()

  if (loading || refreshing) return <div>Loading...</div> // or your loading component

  if (!authenticated) {
    return <Navigate to="/login" />
  }

  return <Outlet/>
}