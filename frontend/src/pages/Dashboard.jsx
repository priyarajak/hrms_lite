import { useEffect, useState } from "react";
import API from "../services/api";
import Header from "../components/layout/Header";


export default function Dashboard() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [employeeStatus, setEmployeeStatus] = useState([]);


  const todayDate = new Date(); // ✅ Date object

const todayISO = todayDate.toISOString().split("T")[0]; // ✅ for API


  const fetchData = async () => {
    try {
      setLoading(true);

      const empRes = await API.get("/employees");
      const employees = empRes.data;
      setTotalEmployees(employees.length);

      let presentCount = 0;
      let absentCount = 0;
      let statusList = [];


      for (let emp of employees) {
        const res = await API.get(`/attendance/${emp.employee_id}`);

        const todayRecord = res.data.find(
          (r) => r.date === todayISO
        );
        let status = "Absent";


        if (todayRecord) {
            status = todayRecord.status;
        }
          if (status === "Present") presentCount++;
          else absentCount++;

        statusList.push({
    employee_id: emp.employee_id,
    name: emp.full_name,
    department: emp.department,
    status
  });
        
      }
      setEmployeeStatus(statusList);
      setPresent(presentCount);
      setAbsent(absentCount);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      
      
  <Header title="Dashboard" />
  

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-white/10 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <p className="text-gray-400">Total Employees</p>
            <h2 className="text-3xl font-bold mt-2">{totalEmployees}</h2>
          </div>

          {/* CARD 2 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <p className="text-gray-400">Present Today</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {present}
            </h2>
          </div>

          {/* CARD 3 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <p className="text-gray-400">Absent Today</p>
            <h2 className="text-3xl font-bold text-red-400 mt-2">
              {absent}
            </h2>
          </div>

        </div>
      )}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">

  <h2 className="text-lg font-medium mb-4">Today’s Attendance</h2>

  {loading ? (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="h-10 bg-white/10 animate-pulse rounded-xl" />
      ))}
    </div>
  ) : employeeStatus.length === 0 ? (
    <p className="text-gray-400">No attendance marked for today yet</p>
  ) : (
    <table className="w-full">
      <thead className="bg-white/10">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Dept</th>
          <th className="p-3 text-left">Status</th>
        </tr>
      </thead>

      <tbody>
        {employeeStatus.map((emp, i) => (
          <tr key={i} className="border-t border-white/10">
            <td className="p-3">{emp.employee_id}</td>
            <td className="p-3">{emp.name}</td>
            <td className="p-3">{emp.department}</td>
            <td className={`px-2 py-1 rounded-full text-xs font-medium ${
    emp.status === "Present"
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400"
  }`}>
              {emp.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
}