import { motion } from "framer-motion";
import "./ui.css";

export default function Input({ className = "", ...props }) {
  return (
    <motion.input
      className={`input-modern ${className}`}
      whileFocus={{ boxShadow: "0 12px 28px rgba(0,0,0,0.35)" }}
      transition={{ duration: 0.2 }}
      {...props}
    />
  );
}