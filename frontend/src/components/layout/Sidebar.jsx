import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar } from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();

  const linkStyle = (path) =>
    `flex items-center gap-3 p-3 rounded-xl ${
      pathname === path ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-white/10"
    }`;

  return (
    <div className="w-64 h-screen bg-white/5 backdrop-blur-xl p-6">
      <h1 className="text-xl font-bold mb-8">HRMS</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/" className={linkStyle("/")}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/employees" className={linkStyle("/employees")}>
          <Users size={18} /> Employees
        </Link>
        <Link to="/attendance" className={linkStyle("/attendance")}>
          <Calendar size={18} /> Attendance
        </Link>
      </nav>
    </div>
  );
}