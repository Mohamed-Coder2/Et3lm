import React, { useEffect, useState } from "react";
import Sidebar from "../../components/teacherBar";
import welcome from "../../../assets/Illustration.svg";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "react-hot-toast";
import { useUser } from "../../../userContext";

const TeacherDashboard = () => {
  const { user } = useUser();
  const [subjects, setSubjects] = useState([]);
  const [subjectStats, setSubjectStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);

  const fetchSubjects = async () => {
    if (!user?.email) return;

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      // Step 1: Get teacher ID
      const idRes = await fetch(`${baseUrl}/api/teachers/by-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ email: user.email })
      });

      const idData = await idRes.json();
      if (!idData.success) throw new Error("Failed to get teacher ID");
      const teacherId = idData.data.id;

      // Step 2: Get teacher assignments
      const assignmentRes = await fetch(`${baseUrl}/api/class-subjects/teachers/${teacherId}/assignments`, {
        headers: {
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true"
        }
      });

      const assignmentData = await assignmentRes.json();
      if (!assignmentData.success) throw new Error("Failed to fetch assignments");

      const formattedSubjects = assignmentData.assignments.map(item => ({
        id: item.subject_code,
        name: item.subject_name,
        subject_id: item.subject_id,
        description: item.subject_description,
        logo: null // Placeholder, update if you have images
      }));

      setSubjects(formattedSubjects);
      if (formattedSubjects.length > 0) {
        setActiveSubject(formattedSubjects[0].subject_id);
      }

    } catch (err) {
      console.error("Subject fetching error:", err);
      toast.error("Failed to load teacher subjects.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [user]);

  useEffect(() => {
    if (subjects.length === 0) return;

    const loadStats = async () => {
      const loadingToast = toast.loading("Loading dashboard data...");
      const allStats = {};

      try {
        for (const subject of subjects) {
          const { subject_id } = subject;

          // Homeworks
          const hwSnap = await getDocs(collection(db, "homeworks", subject_id, "homeworks"));
          const hwIds = hwSnap.docs.map(doc => doc.id);
          let hwScores = [];

          for (const hwId of hwIds) {
            const gradesSnap = await getDocs(
              collection(db, "homeworks", subject_id, "homeworks", hwId, "participantGrades")
            );
            gradesSnap.forEach(doc => {
              const data = doc.data();
              if (data.percentage !== undefined) {
                hwScores.push({ userId: doc.id, percentage: data.percentage });
              }
            });
          }

          // Quizzes
          const quizSnap = await getDocs(collection(db, "quizzes", subject_id, "quizzes"));
          const quizIds = quizSnap.docs.map(doc => doc.id);
          let quizScores = [];

          for (const quizId of quizIds) {
            const gradesSnap = await getDocs(
              collection(db, "quizzes", subject_id, "quizzes", quizId, "participantGrades")
            );
            gradesSnap.forEach(doc => {
              const data = doc.data();
              if (data.percentage !== undefined) {
                quizScores.push({ userId: doc.id, percentage: data.percentage });
              }
            });
          }

          // Averages
          const hwAvg = hwScores.length
            ? hwScores.reduce((sum, s) => sum + s.percentage, 0) / hwScores.length
            : 0;
          const quizAvg = quizScores.length
            ? quizScores.reduce((sum, s) => sum + s.percentage, 0) / quizScores.length
            : 0;

          // Leaderboard
          const merged = [...hwScores, ...quizScores];
          const userMap = {};

          merged.forEach(({ userId, percentage }) => {
            if (!userMap[userId]) {
              userMap[userId] = { total: 0, count: 0 };
            }
            userMap[userId].total += percentage;
            userMap[userId].count += 1;
          });

          const leaderboard = await Promise.all(
            Object.entries(userMap).map(async ([userId, data]) => {
              try {
                const studentDoc = await getDoc(doc(db, "students", userId));
                const name = studentDoc.exists() ? studentDoc.data().name : "Unknown";
                return {
                  name,
                  avg: (data.total / data.count).toFixed(2)
                };
              } catch {
                return { name: "Unknown", avg: (data.total / data.count).toFixed(2) };
              }
            })
          );

          leaderboard.sort((a, b) => b.avg - a.avg);

          allStats[subject_id] = {
            hwCount: hwIds.length,
            quizCount: quizIds.length,
            hwAvg: hwAvg.toFixed(2),
            quizAvg: quizAvg.toFixed(2),
            leaderboard: leaderboard.slice(0, 5)
          };
        }

        setSubjectStats(allStats);
        toast.success("Dashboard data loaded.", { id: loadingToast });
      } catch (err) {
        console.error("Error loading stats:", err);
        toast.error("Failed to load dashboard data.", { id: loadingToast });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [subjects]);

  const handleSubjectChange = (subjectId) => setActiveSubject(subjectId);

  const AnalyticsCard = ({ label, count }) => (
    <div className="bg-white border shadow rounded-md p-4 text-center">
      <p className="text-sm text-gray-500 mb-1 uppercase">{label}</p>
      <p className="text-xl font-bold text-main">{count}</p>
    </div>
  );

  return (
    <div className="h-screen flex bg-white">
      <Sidebar userType="teacher" />
      <div className="flex-1 flex flex-col p-6 mt-20 overflow-auto">
        {/* Banner */}
        <div className="flex items-center justify-between bg-gray-200 rounded-lg h-40 px-6 mb-6">
          <div className="flex flex-col justify-center">
            <p className="text-3xl font-semibold text-blk">Hello Teacher</p>
            <p className="text-gray-600">Here's a summary of your assigned classes!</p>
          </div>
          <img src={welcome} alt="Welcome" className="h-32 w-auto" />
        </div>

        {/* Subject Selector */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {subjects.map(subject => (
            <button
              key={subject.subject_id}
              onClick={() => handleSubjectChange(subject.subject_id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                activeSubject === subject.subject_id
                  ? 'bg-main text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-blk'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>

        {/* Dashboard Panel */}
        {loading ? (
          <p className="text-gray-500 text-center mt-8">Loading dashboard...</p>
        ) : activeSubject && subjects.length > 0 ? (
          <div className="bg-gray-50 border rounded-lg shadow-lg p-6">
            {(() => {
              const subject = subjects.find(s => s.subject_id === activeSubject);
              const stats = subjectStats[activeSubject];
              if (!subject || !stats) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-main2">{subject.name}</h2>
                      <p className="text-sm text-gray-500">{subject.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <AnalyticsCard label="Homeworks" count={stats.hwCount} />
                    <AnalyticsCard label="Quizzes" count={stats.quizCount} />
                    <AnalyticsCard label="Homework Avg" count={`${stats.hwAvg}%`} />
                    <AnalyticsCard label="Quiz Avg" count={`${stats.quizAvg}%`} />
                  </div>

                  <div className="bg-white rounded-md p-4 shadow-sm text-blk">
                    <p className="text-lg font-medium mb-2">Top Students</p>
                    {stats.leaderboard?.length ? (
                      <ul className="space-y-2">
                        {stats.leaderboard.map((student, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{student.name}</span>
                            <span>{student.avg}%</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No student scores available.</p>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">No assigned subjects found.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;