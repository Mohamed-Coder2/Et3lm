import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const Parent = () => {
  const [parents, setParents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "parents"));
        const parentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setParents(parentData);
      } catch (error) {
        console.error("Error fetching parents:", error);
      }
    };

    fetchParents();
  }, []);

  return (
    <div className="bg-white flex min-h-screen">
      <Sidebar userType="admin" />

      <div className="flex-1 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-main">Parents</h1>
          <button
            onClick={() => navigate("/admin/parents/assign")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
          >
            Assign Student
          </button>
        </div>

        <ParentsTable data={parents} />
      </div>
    </div>
  );
};

const ParentsTable = ({ data }) => {
  return (
    <div className="bg-gray-300 rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
      <table className="w-full table-auto text-left text-black">
        <thead>
          <tr className="text-main2">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((parent, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3 flex items-center gap-3">
                <img
                  src={parent.profile_picture || "/default-pfp.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{parent.name}</span>
              </td>
              <td className="px-4 py-3">{parent.email}</td>
              <td className="px-4 py-3">{parent.phone_number || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Parent;
