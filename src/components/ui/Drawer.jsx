import { AnimatePresence, motion } from "framer-motion";
import "./ui.css";

export default function Drawer({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="drawer-panel"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}