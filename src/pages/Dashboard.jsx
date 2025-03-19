import { Sidebar } from "@/components/ui/SideBarDashboard";
import { Outlet } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <Sidebar/>
      </div>
      <Outlet/>
    </div>
  )
}