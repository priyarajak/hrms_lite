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

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ADD EMPLOYEE
  const handleAdd = async () => {
    if (!form.employee_id || !form.full_name || !form.email || !form.department || !form.joining_date) {
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
      toast.error(err.response?.data?.detail || "Error adding employee");
    }
  };

  // DELETE EMPLOYEE
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
    <div className="max-w-5xl mx-auto space-y-6">

      <Header title="Employees" />
      {/* ================= FORM ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">

        <div className="grid md:grid-cols-5 gap-3">

          <Input
            value={form.employee_id}
            placeholder="ID"
            onChange={e => setForm({ ...form, employee_id: e.target.value })}
          />

          <Input
            value={form.full_name}
            placeholder="Name"
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />

          <Input
            value={form.email}
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <Input
            value={form.department}
            placeholder="Dept"
            onChange={e => setForm({ ...form, department: e.target.value })}
          />

          <Input
            type="date"
            value={form.joining_date}
            onChange={e => setForm({ ...form, joining_date: e.target.value })}
          />

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
        <p className="text-gray-400">No employees found</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block">
            <table className="w-full border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Dept</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {employees.length === 0 ? (
        <tr>
          <td colSpan="4" className="text-center p-6 text-gray-400">
            No employees found
          </td>
        </tr>
      ) : (employees.map(emp => (
                  <tr key={emp.id} className="border-t border-white/10 hover:bg-white/5">
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
                )))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
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