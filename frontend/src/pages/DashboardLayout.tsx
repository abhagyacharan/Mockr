import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Brain,
  LayoutDashboard,
  Upload,
  History,
  User,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Suspense } from "react";

// You can replace these with your shadcn/ui components if available
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Mockr</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogout}
                  className="ml-2 cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 sm:p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
