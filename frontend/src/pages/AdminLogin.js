import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../utils/api";
const AdminLogin = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleGoogleSuccess = async (credentialResponse) => {
        setError("");
        try {
            const response = await googleLogin(credentialResponse.credential);
            if (response.success) {
                localStorage.setItem("adminToken", response.token);
                localStorage.setItem("adminUser", JSON.stringify({
                    email: response.user.email,
                    name: response.user.name
                }));
                navigate("/admin/dashboard");
            }
            else {
                setError(response.message || "Unauthorized access");
            }
        }
        catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Authentication failed. Please try again.");
        }
    };
    const handleGoogleError = () => {
        setError("Google Sign-In failed. Please try again.");
    };
    return (_jsx("div", { className: "admin-login", children: _jsxs("div", { className: "login-container", children: [_jsxs("div", { className: "login-header", children: [_jsx("h1", { children: "\uD83D\uDD10 Admin Portal" }), _jsx("p", { className: "login-subtitle", children: "Portfolio Management System" })] }), _jsxs("div", { className: "login-content", children: [_jsx("p", { className: "login-description", children: "Sign in with your authorized Google account to access the admin dashboard." }), _jsx("div", { className: "google-login-wrapper", children: _jsx(GoogleLogin, { onSuccess: handleGoogleSuccess, onError: handleGoogleError, theme: "filled_blue", size: "large", text: "signin_with", shape: "rectangular" }) }), error && (_jsxs("div", { className: "error-message", children: [_jsx("span", { className: "error-icon", children: "\u26A0\uFE0F" }), error] })), _jsx("div", { className: "login-footer", children: _jsx("p", { className: "login-hint", children: "\uD83D\uDD12 Only authorized Google accounts can access this panel" }) })] })] }) }));
};
export default AdminLogin;
