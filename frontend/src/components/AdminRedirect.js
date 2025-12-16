import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyAuth } from "../utils/api";
const AdminRedirect = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    useEffect(() => {
        checkAuth();
    }, []);
    const checkAuth = async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            setIsAuthenticated(false);
            return;
        }
        try {
            await verifyAuth();
            setIsAuthenticated(true);
        }
        catch (error) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            setIsAuthenticated(false);
        }
    };
    if (isAuthenticated === null) {
        return (_jsxs("div", { className: "admin-loading", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: "Checking authentication..." })] }));
    }
    return isAuthenticated ? (_jsx(Navigate, { to: "/admin/dashboard", replace: true })) : (_jsx(Navigate, { to: "/admin/login", replace: true }));
};
export default AdminRedirect;
