import { motion } from "framer-motion";
import "./ui.css";

export default function Card({ children, className = "", ...props }) {
  return (
    <motion.div
      className={`card ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}