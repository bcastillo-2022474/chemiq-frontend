import { useAuth } from "@/context/auth";
import { NotEnoughPermissions } from "@/components/NotEnoughPermissions";

export function UserRoutes() {
  const { loading, user } = useAuth();

  if (loading) return;
  const isAuthenticated = user.rol === "Admin" || user.rol === "User";

  if (!isAuthenticated) return <NotEnoughPermissions/>;

  return (
    <>
      {/* PUT THE ROUTES HERE */}
    </>
  )
}