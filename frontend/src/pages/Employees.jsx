import { useEffect, useState } from "react";
import API from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
    joining_date: ""
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      toast.error("Failed to load employees");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = async () => {
    if (
      !form.employee_id ||
      !form.full_name ||
      !form.email ||
      !form.department ||
      !form.joining_date
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      await API.post("/employees", form);
      toast.success("Employee added");

      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
        joining_date: ""
      });

      fetchEmployees();
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Something went wrong";

      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/employees/${id}`);
      toast.success("Deleted successfully");
      fetchEmployees();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-0 space-y-6">

      <Header title="Employees" />

      {/* ================= FORM ================= */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-5">

        {/* 🔥 FIXED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">

          {/* EMPLOYEE ID */}
          <div className="relative group min-w-0">
            <Input
              value={form.employee_id}
              placeholder="Employee ID"
              onChange={e => setForm({ ...form, employee_id: e.target.value })}
              className="w-full min-w-0"
            />
          </div>

          {/* NAME */}
          <div className="relative group min-w-0">
            <Input
              value={form.full_name}
              placeholder="Full Name"
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              className="w-full min-w-0"
            />

            <div className="absolute left-0 top-full mt-1 text-xs text-gray-400 opacity-0 
              group-hover:opacity-100 group-focus-within:opacity-100 transition">
              Example: Priya Rajak
            </div>
          </div>

          {/* EMAIL */}
          <div className="relative group min-w-0">
            <Input
              value={form.email}
              placeholder="Email Address"
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full min-w-0"
            />

            <div className="absolute left-0 top-full mt-1 text-xs text-gray-400 opacity-0 
              group-hover:opacity-100 group-focus-within:opacity-100 transition">
              Example: priya@email.com
            </div>
          </div>

          {/* DEPARTMENT */}
          <div className="relative group min-w-0">
            <Input
              value={form.department}
              placeholder="Department"
              onChange={e => setForm({ ...form, department: e.target.value })}
              className="w-full min-w-0"
            />

            <div className="absolute left-0 top-full mt-1 text-xs text-gray-400 opacity-0 
              group-hover:opacity-100 group-focus-within:opacity-100 transition">
              Example: HR / IT / Sales
            </div>
          </div>

          {/* JOINING DATE (🔥 FIXED PROPERLY) */}
          <div className="relative group min-w-0">
            <Input
              type="date"
              value={form.joining_date}
              onChange={(e) =>
                setForm({ ...form, joining_date: e.target.value })
              }
              className="w-full min-w-0"
            />

            {/* ICON */}
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm pointer-events-none">
              📅
            </span>

            <div className="absolute left-0 top-full mt-1 text-xs text-gray-400 opacity-0 
              group-hover:opacity-100 group-focus-within:opacity-100 transition">
              Joining Date
            </div>
          </div>

        </div>

        <Button onClick={handleAdd}>Add Employee</Button>
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-white/10 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <p className="text-gray-400 text-center">No employees found</p>
      ) : (
        <>
          {/* ================= TABLE ================= */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full min-w-[500px] border border-white/10 rounded-xl overflow-hidden">

              <thead className="bg-white/10">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Dept</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="border-t border-white/10 even:bg-white/5">
                    <td className="p-3">{emp.full_name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(emp.employee_id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 transition"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-3">
            {employees.map(emp => (
              <div
                key={emp.id}
                className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{emp.full_name}</p>
                  <p className="text-sm text-gray-400">{emp.email}</p>
                  <p className="text-sm">{emp.department}</p>
                </div>

                <button
                  onClick={() => handleDelete(emp.employee_id)}
                  className="p-2 rounded-lg hover:bg-red-500/20"
                >
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}