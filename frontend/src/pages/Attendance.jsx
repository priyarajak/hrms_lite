import { useEffect, useState } from "react";
import API from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);

  const [filters, setFilters] = useState({
    employee_id: "",
    from: "",
    to: ""
  });

  const [data, setData] = useState({
    employee_id: "",
    date: "",
    status: "Present"
  });

  useEffect(() => {
    API.get("/employees").then(res => setEmployees(res.data));
  }, []);

  const fetchAttendance = async () => {
    if (!filters.employee_id) {
      toast.error("Select employee");
      return;
    }

    try {
      const res = await API.get(`/attendance/${filters.employee_id}`);

      let filtered = res.data;

      if (filters.from) {
        filtered = filtered.filter(r => r.date >= filters.from);
      }

      if (filters.to) {
        filtered = filtered.filter(r => r.date <= filters.to);
      }

      setRecords(filtered);

      if (filtered.length === 0) {
        toast("No records found");
      }

    } catch (err) {
      toast.error("Error fetching records");
    }
  };

  const markAttendance = async () => {
    const emp = employees.find(e => e.employee_id === data.employee_id);

    if (!emp) {
      toast.error("Select employee");
      return;
    }

    if (new Date(data.date) < new Date(emp.joining_date)) {
      toast.error("Before joining date not allowed");
      return;
    }

    try {
      await API.post("/attendance", data);

      toast.success("Attendance marked");

      setData({
        employee_id: "",
        date: "",
        status: "Present"
      });

    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-2 sm:px-0">

      <Header title="Attendance" />

      {/* ================= MARK ATTENDANCE ================= */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">

        <h2 className="text-lg font-medium">Mark Attendance</h2>

        <div className="space-y-4">

          {/* EMPLOYEE SELECT */}
          <select
            className="w-full min-w-0 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={data.employee_id}
            onChange={(e) => setData({...data, employee_id: e.target.value})}
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.full_name}
              </option>
            ))}
          </select>

          {/* DATE INPUT FIXED */}
          <div className="relative w-full min-w-0">
            <Input
              type="date"
              value={data.date}
              onChange={(e) => setData({...data, date: e.target.value})}
              className="w-full min-w-0"
            />
          </div>

          {/* STATUS BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setData({...data, status: "Present"})}
              className={`flex-1 py-2 rounded-xl transition ${
                data.status === "Present"
                  ? "bg-green-500 text-white"
                  : "bg-white/10"
              }`}
            >
              ✅ Present
            </button>

            <button
              onClick={() => setData({...data, status: "Absent"})}
              className={`flex-1 py-2 rounded-xl transition ${
                data.status === "Absent"
                  ? "bg-red-500 text-white"
                  : "bg-white/10"
              }`}
            >
              ❌ Absent
            </button>
          </div>

          <Button onClick={markAttendance} className="w-full">
            Submit Attendance
          </Button>

        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">

        <h2 className="text-lg font-medium">Search Records</h2>

        {/* 🔥 FIXED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

          <select
            className="w-full min-w-0 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.employee_id}
            onChange={(e) =>
              setFilters({ ...filters, employee_id: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.full_name}
              </option>
            ))}
          </select>

          {/* FROM DATE */}
          <Input
            type="date"
            value={filters.from}
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
            className="w-full min-w-0"
          />

          {/* TO DATE */}
          <Input
            type="date"
            value={filters.to}
            onChange={(e) =>
              setFilters({ ...filters, to: e.target.value })
            }
            className="w-full min-w-0"
          />

        </div>

        <Button onClick={fetchAttendance}>Search</Button>

        {/* RESULTS TABLE */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center p-6 text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        r.status === "Present"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}