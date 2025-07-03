import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import defaultPfp from '../../../../assets/default-avatar.png';
import toast from "react-hot-toast";

const Users = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [userToDelete, setUserToDelete] = useState(null); // NEW
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!userToDelete) return;

    const toastId = toast.loading("Deleting user...");
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/students/${userToDelete.ID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("User deleted successfully.", { id: toastId });
        // ✅ Log to adminLogs
        const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
        await setDoc(doc(collection(db, "adminLogs")), {
          action: "delete_student",
          timestamp: serverTimestamp(),
          performedBy: {
            email: adminData.email || "unknown",
            name: `${adminData.firstName || ""} ${adminData.lastName || ""}`.trim(),
            image: adminData.image || "",
          },
          studentEmail: userToDelete.Email,
          studentName: `${userToDelete.FirstName} ${userToDelete.LastName}`.trim(),
        });
        // Remove the deleted user from state
        setStudents((prev) => prev.filter((u) => u.ID !== userToDelete.ID));
      } else {
        toast.error(result.message || "Failed to delete user.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting.", { id: toastId });
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const fetchStudents = async (forceRefresh = false) => {
    const cacheKey = "students_cache";
    const cacheTTL = 60 * 60 * 1000; // 1 hour

    const cached = localStorage.getItem(cacheKey);
    if (!forceRefresh && cached) {
      const { timestamp, data } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < cacheTTL;

      if (isFresh) {
        setStudents(data);
        return;
      }
    }

    const toastId = toast.loading("Loading students...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const result = await response.json();

      if (result.success && result.data?.students) {
        const formatted = result.data.students.map((student) => ({
          ID: student.id,
          Pfp: student.image
            ? `${import.meta.env.VITE_BACKEND_URL}/storage/${student.image}`
            : defaultPfp,
          FirstName: student.first_name,
          LastName: student.last_name,
          Email: student.email,
          Role: "Student",
          ClassID: student.class_id ?? "Unassigned",
          ClassName: student.class?.class_name ?? "N/A",
        }));

        setStudents(formatted);
        localStorage.setItem("totalStudents", formatted.length);
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: formatted }));
        toast.success("Students fetched successfully", { id: toastId });
      } else {
        toast.error(`Failed to fetch students: ${result.message}`, { id: toastId });
      }
    } catch (error) {
      toast.error("Error fetching students", { id: toastId });
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredUsers = students.filter(user =>
    user.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) || user.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.ID.toString().includes(searchQuery)
  );

  const handleEditClick = (user) => {
    navigate(`/admin/students/edit/${user.ID}`, { state: { user } });
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType="admin" />

      <div className="w-4/5 flex flex-col items-center">
        <div className="w-4/5 flex items-center justify-between text-blk h-16 p-2 m-4">
          <p className="text-3xl text-main">Students</p>
          <div>
            <button
              onClick={() => fetchStudents(true)}
              className="bg-gray-300 rounded-md text-black px-3 py-2 hover:bg-gray-400 m-2 hover:cursor-pointer"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate('/admin/students/add')}
              className="bg-main rounded-md text-white p-2 hover:bg-main2 hover:cursor-pointer ml-2">Add User</button>
          </div>
        </div>

        <div className="w-4/5">
          <div className="flex items-center justify-center text-blk">
            <div className="rounded-lg bg-gray-200 p-1.5 w-full">
              <div className="flex">
                <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
                  <svg viewBox="0 0 20 20" className="pointer-events-none absolute w-5 fill-gray-500 transition">
                    <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
                  </svg>
                </div>
                <input
                  name="search"
                  id="search"
                  type="text"
                  className="p-2 w-full bg-white text-base font-semibold outline-0"
                  placeholder="Search by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 text-blk">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">User ID</th>
                  <th className="py-2 px-4 border-b">Profile</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Class</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredUsers.map(user => (
                  <tr key={user.ID}>
                    <td className="py-2 px-4 border-b">{user.ID}</td>
                    <td className="py-2 px-4 border-b">
                      <img src={user.Pfp} alt="pfp" className="w-10 h-10 rounded-full mx-auto object-cover" />
                    </td>
                    <td className="py-2 px-4 border-b">{user.FirstName} {user.LastName}</td>
                    <td className="py-2 px-4 border-b">{user.Email}</td>
                    <td className="py-2 px-4 border-b">{user.ClassName}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-main hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md"
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-gray-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              You're about to delete user <strong>{userToDelete.FirstName} {userToDelete.LastName}</strong>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md hover:cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
