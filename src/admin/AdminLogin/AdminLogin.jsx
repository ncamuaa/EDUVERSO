import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../assets/2logo.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("admin_logged_in", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid admin credentials");
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

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="admin-input-wrapper">
            <input
              type="text"
              placeholder="Username"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          {/* Button */}
          <button type="submit" className="admin-btn">
            Login
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
