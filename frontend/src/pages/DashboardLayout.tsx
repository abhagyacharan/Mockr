import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Brain, User, LogOut } from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const currentPath = location.pathname;

  const getTabClass = (path: string) =>
    `inline-flex cursor-pointer items-center justify-center px-4 py-1.5 text-sm font-medium rounded-md ${
      currentPath.includes(path)
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-600"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-75/100 mx-auto px-4 py-4 flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
          >
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Mockr</span>
          </div>

          <div className="inline-flex h-10 items-center rounded-md bg-gray-200 p-1">
            <button className={getTabClass("dashboard")} onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
            <button className={getTabClass("uploadinterface")} onClick={() => navigate("/uploadinterface")}>
              New Mock
            </button>
            <button className={getTabClass("history")} onClick={() => navigate("/history")}>
              History
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center h-9 px-3 rounded-md text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic page content */}
      <div className="w-75/100 mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
