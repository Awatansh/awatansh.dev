import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyAuth } from "../utils/api";
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
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
        }
        catch (error) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            navigate("/admin/login", { state: { from: location }, replace: true });
        }
    };
    if (isAuthenticated === null) {
        return (_jsx("div", { className: "admin-loading", children: _jsx("div", { className: "loading-spinner", children: "\uD83D\uDD10 Verifying access..." }) }));
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
