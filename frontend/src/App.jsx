import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Sidebar from "./components/layout/Sidebar";
import MobileNav from "./components/layout/MobileNav";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}   // ✅ VERY IMPORTANT
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row min-h-screen">

        {/* Sidebar (desktop) */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main */}
        <div className="flex-1 p-4 md:p-6 pb-24">
          <AnimatedRoutes />
        </div>

        {/* Mobile Nav */}
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}