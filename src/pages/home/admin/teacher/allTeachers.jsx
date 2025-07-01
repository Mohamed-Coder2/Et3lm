import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { TeachersTable } from "../../../components/table";
import Sidebar from "../../../components/sidebar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      const promise = getDocs(collection(db, "teachers"))
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          setTeachers(data);
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
          <button className="bg-main text-white p-2 rounded-md hover:cursor-pointer hover:bg-main2" onClick={() => {navigate('/admin/teacher/create')}}>Add Teacher</button>
        </div>

        <TeachersTable data={teachers} />

      </div>
    </div>
  );
};

export default AllTeachersPage;
