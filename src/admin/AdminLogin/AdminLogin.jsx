import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../assets/2logo.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");       // FIXED: email instead of username
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
     const response = await fetch(
  "https://eduversooo-production-4eaf.up.railway.app/api/auth/login",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }
);


      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // ONLY ALLOW ADMINS
      if (data.user.role !== "admin") {
        setError("Access denied — you are not an admin.");
        return;
      }

      // SAVE ADMIN SESSION
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_email", data.user.email);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <motion.div
      className="admin-login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="admin-login-card"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <img src={logo} className="admin-login-img" alt="Admin Login" />

        <h2 className="admin-title">Admin Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="admin-input-wrapper">
            <input
              type="email"
              placeholder="Email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="admin-input-wrapper">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="show-password"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Login Button */}
          <button type="submit" className="admin-btn">
            Login
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
