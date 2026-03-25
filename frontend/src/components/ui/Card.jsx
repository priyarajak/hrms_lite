import { motion } from "framer-motion";

export default function Card({ children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, rotateX: 2 }}
      transition={{ duration: 0.3 }}
     className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:scale-[1.02] transition"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-0 hover:opacity-100 transition" />

      {children}
    </motion.div>
  );
}