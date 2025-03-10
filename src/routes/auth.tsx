import { useAuth } from "@/context/auth";
import { Navigate, Outlet } from "react-router-dom";

export function Auth() {
  const { authenticated, loading } = useAuth()

  if (loading) return;


  if (!authenticated) {
    // navigate("/login");

    return <Navigate to="/login" />;
  }

  return <Outlet/>
}