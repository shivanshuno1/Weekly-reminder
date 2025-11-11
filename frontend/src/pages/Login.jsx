import React, { useState } from "react";
import api from "../components/services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  
  try {
    console.log("🔄 Attempting login with fetch...");
    
    // Temporary: Use fetch instead of axios
    const response = await fetch('https://weekly-reminder-psmf.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    console.log("✅ Login response:", result);
    
    if (result.success) {
      localStorage.setItem("user", JSON.stringify(result.data));
      navigate("/");
    } else {
      setError(result.message || "Login failed");
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    setError("Login failed. Check your credentials.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="login-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="login-card relative w-full max-w-md p-10 rounded-3xl shadow-2xl text-white">
        <h2 className="login-title text-4xl font-extrabold mb-8 text-center">
          Welcome Back
        </h2>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="input-container relative">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field peer"
              required
              disabled={isLoading}
            />
            <label className="input-label">Email</label>
          </div>

          <div className="input-container relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field peer pr-12"
              required
              disabled={isLoading}
            />
            <label className="input-label">Password</label>
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button 
            type="submit" 
            className="login-btn flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account?{" "}
          <Link 
            to="/register" 
            className="text-blue-400 hover:text-purple-400 hover:underline transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;