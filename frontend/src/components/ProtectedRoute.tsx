import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyAuth } from "../utils/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]); // Re-check auth on route change

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login", { state: { from: location }, replace: true });
        return;
      }

      await verifyAuth();
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin/login", { state: { from: location }, replace: true });
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">🔐 Verifying access...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
