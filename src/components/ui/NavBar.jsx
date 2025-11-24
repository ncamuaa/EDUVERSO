import { motion } from "framer-motion";
import "./ui.css";

export default function NavBar({ title = "EduVerso", logoSrc, onMenuToggle }) {
  return (
    <motion.nav className="navbar-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {onMenuToggle && (
        <motion.button className="btn btn-secondary btn-sm menu-btn" onClick={onMenuToggle} whileHover={{ scale: 1.05 }}>
          ☰
        </motion.button>
      )}
      <div className="brand">
        {logoSrc && <img src={logoSrc} alt="Logo" style={{ height: 36 }} />}
        <span>{title}</span>
      </div>
    </motion.nav>
  );
}