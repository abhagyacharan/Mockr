import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Brain,
  LayoutDashboard,
  Upload,
  History,
  User,
  FileCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/upload", icon: Upload, label: "New Mock" },
  { href: "/atschecker", icon: FileCheck, label: "ATS Checker" },
  { href: "/history", icon: History, label: "History" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, token } = useAuth();
  const currentPath = location.pathname;

  useEffect(() => {
    if (!token || !user) {
      navigate("/", { replace: true });
    }
  }, [token, user, navigate]);

  if (!token || !user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16 border-b">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-7 w-7 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900 xs:hidden">
                Mockr
              </span>
            </Link>

            {/* User & Logout */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name}
                </p>
              </div>

              {/* Full button on desktop, icon on mobile */}
              <div className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </Button>
              </div>
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-1 py-3 text-sm font-medium border-b-2 snap-start transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
