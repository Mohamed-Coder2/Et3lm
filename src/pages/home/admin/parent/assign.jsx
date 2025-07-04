import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import toast from "react-hot-toast";

const AssignStudentToParent = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentsSnap = await getDocs(collection(db, "parents"));
        const studentsSnap = await getDocs(collection(db, "students"));

        setParents(parentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setStudents(studentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        toast.error("Error loading data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedParent || selectedStudents.length === 0) {
      toast.error("Select a parent and at least one student.");
      return;
    }

    try {
      const parentRef = doc(db, "parents", selectedParent);
      await updateDoc(parentRef, {
        children: arrayUnion(...selectedStudents),
      });

      toast.success("Students successfully assigned.");
      setSelectedStudents([]);
    } catch (err) {
      console.error("Assignment failed:", err);
      toast.error("Failed to assign students.");
    }
  };

  return (
    <div className="bg-white flex min-h-screen">
      <Sidebar userType="admin" />

      <div className="flex flex-col items-center p-6 space-y-6 text-blk w-3/4">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Assign Students to Parent</h1>
          {/* Back */}
          <button
            onClick={() => navigate("/admin/parents")}
            className="mt-2 text-blue-600 underline hover:cursor-pointer"
          >
            ← Back to Parent List
          </button>
        </div>

        <div className="bg-gray-100 shadow-2xl p-4 rounded-md flex flex-col items-center">
          <div className="max-w-md space-y-2">
            <label className="block text-sm font-medium">Select Parent:</label>
            <select
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">-- Choose a parent --</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name} ({parent.email})
                </option>
              ))}
            </select>
          </div>

          {/* Student List */}
          <div className="flex flex-col w-fit">
            <h2 className="text-xl font-semibold mt-6 mb-2">Select Students:</h2>
            <div className="">
              {students.map((student) => (
                <label
                  key={student.id}
                  className="flex items-center gap-3 p-3 bg-gray-100 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleCheckboxChange(student.id)}
                  />
                  <img
                    src={student["profile-picture"] || "/default-pfp.png"}
                    alt="pfp"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.email}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAssign}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
          >
            Assign Selected Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStudentToParent;