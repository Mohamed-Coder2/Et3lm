import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { TeachersTable } from "../../../components/table";
import Sidebar from "../../../components/sidebar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [resetEmail, setResetEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!resetEmail) return toast.error("Please enter an email.");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Reset email sent!");
      setResetEmail("");
    } catch (error) {
      toast.error("Error: " + error.message);
      console.error(error);
    }
  };


  useEffect(() => {
    const fetchTeachers = async () => {
      const promise = getDocs(collection(db, "teachers"))
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          setTeachers(data);
          localStorage.setItem("totalTeachers", data.length); // Save to localStorage
        });

      toast.promise(promise, {
        loading: 'Loading teachers...',
        success: 'Teachers loaded!',
        error: 'Failed to load teachers.',
      }).finally(() => setLoading(false));
    };

    fetchTeachers();
  }, []);

  return (
    <div className="flex bg-white">
      <Sidebar userType="admin" />
      <div className="w-4/5 p-8 text-main">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">All Teachers</h1>
          <button className="bg-main text-white p-2 rounded-md hover:cursor-pointer hover:bg-main2" onClick={() => { navigate('/admin/teacher/create') }}>Add Teacher</button>
          <button className="bg-main text-white p-2 rounded-md hover:cursor-pointer hover:bg-main2" onClick={() => { navigate('/admin/teacher/assign') }}>Assign Teacher to Subject</button>
        </div>

        <TeachersTable data={teachers} />

        <div className="mb-6 p-4 bg-gray-100 rounded-md flex flex-col items-center justify-center w-full">
          <h2 className="text-lg font-semibold mb-2">Reset Teacher Password</h2>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              placeholder="Enter teacher's email"
              className="p-2 border rounded w-80"
              onChange={(e) => setResetEmail(e.target.value)}
              value={resetEmail}
            />
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handlePasswordReset}
            >
              Send Reset Link
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllTeachersPage;
