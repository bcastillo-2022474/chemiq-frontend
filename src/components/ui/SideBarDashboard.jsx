import { LayoutDashboard, Users, FlaskRoundIcon as Flask, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/stats' },
  { name: 'Users', icon: Users, href: '/dashboard/users' },
  { name: 'Projects', icon: Flask, href: '/dashboard/projects' },
  { name: 'Settings', icon: Settings, href: '/settings' }
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.clear();
    navigate("/login")
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1e2532] text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Chemistry Lab</h1>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 transition-colors ${
              location.pathname === item.href
                ? 'text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-5 w-full flex items-center gap-3 bg-red-500 p-3 rounded-lg text-gray-300 hover:text-white transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}
