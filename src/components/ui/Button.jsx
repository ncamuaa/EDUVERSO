import { motion } from "framer-motion";
import "./ui.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const classes = `btn btn-${variant} btn-${size} ${className}`;
  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}