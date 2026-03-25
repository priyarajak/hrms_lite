import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar } from "lucide-react";

export default function MobileNav() {
  const { pathname } = useLocation();

  const iconStyle = (path) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? "text-indigo-400" : "text-gray-400"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around py-3 md:hidden">

      <Link to="/" className={iconStyle("/")}>
        <LayoutDashboard size={20} />
        <span>Home</span>
      </Link>

      <Link to="/employees" className={iconStyle("/employees")}>
        <Users size={20} />
        <span>Employees</span>
      </Link>

      <Link to="/attendance" className={iconStyle("/attendance")}>
        <Calendar size={20} />
        <span>Attendance</span>
      </Link>

    </div>
  );
}