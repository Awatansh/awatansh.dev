import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { googleLogin } from "../utils/api";

const AdminLogin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError("");

    try {
      const response = await googleLogin(credentialResponse.credential!);
      if (response.success) {
        localStorage.setItem("adminToken", response.token);
        localStorage.setItem("adminUser", JSON.stringify({
          email: response.user.email,
          name: response.user.name
        }));
        navigate("/admin/dashboard");
      } else {
        setError(response.message || "Unauthorized access");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>🔐 Admin Portal</h1>
          <p className="login-subtitle">Portfolio Management System</p>
        </div>
        
        <div className="login-content">
          <p className="login-description">
            Sign in with your authorized Google account to access the admin dashboard.
          </p>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="login-footer">
            <p className="login-hint">
              🔒 Only authorized Google accounts can access this panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
