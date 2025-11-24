import { motion } from "framer-motion";
import "./ui.css";

export default function PageShell({ title, logoSrc, onBack, right, children }) {
  return (
    <div className="page-shell">
      <motion.header className="page-hero" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onBack && (
            <motion.button className="btn btn-secondary btn-sm" onClick={onBack} whileHover={{ scale: 1.05 }}>
              ←
            </motion.button>
          )}
          {logoSrc && <img src={logoSrc} alt="Logo" style={{ height: 28 }} />}
          <span className="title">{title}</span>
        </div>
        <div>{right}</div>
      </motion.header>
      <div className="page-content">{children}</div>
    </div>
  );
}