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

  // fetch employees
  useEffect(() => {
    API.get("/employees").then(res => setEmployees(res.data));
  }, []);

  // 🔍 FETCH ATTENDANCE
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

  // ✅ MARK ATTENDANCE
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

      // CLEAR FORM
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
    <div className="max-w-5xl mx-auto space-y-8">

      <Header title="Attendance" />

      {/* ================= MARK ATTENDANCE ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">

        <h2 className="text-lg font-medium">Mark Attendance</h2>

        <div className="space-y-3">

          <select
            className="w-full p-2 rounded-xl bg-white/5 border border-white/10"
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

          <Input
            type="date"
            value={data.date}
            onChange={(e) => setData({...data, date: e.target.value})}
          />

          <div className="flex gap-4">
            <button
              onClick={() => setData({...data, status: "Present"})}
              className={`flex-1 py-2 rounded-xl ${
                data.status === "Present"
                  ? "bg-green-500"
                  : "bg-white/10"
              }`}
            >
              ✅ Present
            </button>

            <button
              onClick={() => setData({...data, status: "Absent"})}
              className={`flex-1 py-2 rounded-xl ${
                data.status === "Absent"
                  ? "bg-red-500"
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

      {/* ================= SEARCH + FILTER ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">

        <h2 className="text-lg font-medium">Search Records</h2>

        <div className="grid md:grid-cols-3 gap-4">

          <select
            className="p-2 rounded-xl bg-white/5 border border-white/10"
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

          <Input
            type="date"
            value={filters.from}
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
          />

          <Input
            type="date"
            value={filters.to}
            onChange={(e) =>
              setFilters({ ...filters, to: e.target.value })
            }
          />

        </div>

        <Button onClick={fetchAttendance}>Search</Button>

        {/* RESULTS */}
        <div className="mt-4">
  <table className="w-full">
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
            <td className={
              r.status === "Present"
                ? "text-green-400"
                : "text-red-400"
            }>
              {r.status}
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