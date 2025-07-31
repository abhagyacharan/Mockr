import { API_BASE_URL } from "@/lib/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Fix: Use consistent key "access_token"
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else if (response.status === 401 || response.status === 403) {
            // Token is invalid, clear everything
            console.log("Token invalid, logging out");
            logout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
    };

    fetchUser();
  }, [token]);

  const login = (newToken: string, user: User) => {
    // Fix: Use consistent key "access_token"
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(newToken);
    setUser(user);
  };

  const logout = () => {
    // Fix: Use consistent key "access_token"
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
