import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Sidebar from "../../components/sidebar";
import welcome from "../../../assets/Illustration.svg";
import user from '../../../assets/users.svg';
import subject from '../../../assets/subjects.svg';
import teacher from '../../../assets/teacher.png';
import classes from '../../../assets/classes.svg';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);

  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);

  const fetchLogs = async () => {
    try {
      const logsRef = collection(db, "adminLogs");
      const q = query(logsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();

    setTotalTeachers(parseInt(localStorage.getItem("totalTeachers") || "0"));
    setTotalStudents(parseInt(localStorage.getItem("totalStudents") || "0"));
    setTotalClasses(parseInt(localStorage.getItem("totalClasses") || "0"));
    setTotalSubjects(parseInt(localStorage.getItem("totalSubjects") || "0"));
  }, []);

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar userType="admin" />

      <div className="flex flex-col gap-6 p-6 mt-20 ml-8 w-3/4 overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-gray-200 rounded-lg h-40 px-6">
          <div className="flex flex-col justify-center">
            <p className="text-3xl font-semibold text-blk">Hello Admin</p>
            <p className="text-gray-600">It's good to see you again!</p>
          </div>
          <img src={welcome} alt="Welcome" className="h-32 w-auto" />
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <AnalyticsCard label="Teachers" count={totalTeachers} icon={teacher} />
          <AnalyticsCard label="Students" count={totalStudents} icon={user} />
          <AnalyticsCard label="Classes" count={totalClasses} icon={classes} />
          <AnalyticsCard label="Subjects" count={totalSubjects} icon={subject} />
        </div>

        {/* Admin Logs Console */}
        <div className="flex flex-col flex-grow overflow-hidden mt-4">
          <p className="text-lg font-semibold mb-2">Admin Logs</p>
          <div className="bg-black/90 text-green-400 font-mono p-4 rounded-md overflow-auto text-sm border border-gray-600 flex-grow">
            {logs.length === 0 ? (
              <p className="text-gray-400">No logs available.</p>
            ) : (
              logs.map((log, index) => (
                <div key={log.id} className="mb-2">
                  <p>
                    [{new Date(log.timestamp?.toDate?.()).toLocaleString() || "unknown"}] <br />
                    <span className="text-yellow-400">{log.performedBy?.name || "Unknown"}</span>
                    ({log.performedBy?.email || "N/A"}) ➜ <strong className="text-white">{log.action}</strong>
                  </p>

                  {log.studentName && (
                    <p className="ml-4">Deleted student: <span className="text-white">{log.studentName}</span></p>
                  )}
                  {log.subjectName && (
                    <p className="ml-4">Deleted subject: <span className="text-white">{log.subjectName}</span></p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ label, count, icon }) => (
  <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 text-center flex flex-col items-center gap-3">
    <img src={icon} alt={`${label} icon`} className="h-10 w-10 filter invert-0 brightness-0" />
    <p className="text-sm text-gray-500 uppercase">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{count}</p>
  </div>
);

export default Dashboard;