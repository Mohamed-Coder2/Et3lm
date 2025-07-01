import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Subjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const openDeleteModal = (sbj) => {
    setSelectedSubject(sbj);
    setShowDeleteModal(true);
  };

  const handleDeleteClick = async (sbj) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${sbj.Name}"?`);
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting subject...");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/${sbj.ID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("Subject deleted", { id: toastId });
        localStorage.removeItem("subjects_cache");
        fetchSubjects(true); // Force refresh
      } else {
        const result = await res.json();
        toast.error(result.message || "Failed to delete subject", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting", { id: toastId });
    }
  };


  const fetchSubjects = async (forceRefresh = false) => {
    const cacheKey = "subjects_cache";
    const cacheTTL = 60 * 60 * 1000; // 1 hour

    const cached = localStorage.getItem(cacheKey);
    if (!forceRefresh && cached) {
      const { timestamp, data } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < cacheTTL;
      if (isFresh) {
        setSubjects(data);
        return;
      }
    }

    const toastId = toast.loading("Loading subjects...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const result = await res.json();

      if (res.ok && result.data) {
        const formatted = result.data.map((subj) => ({
          ID: subj.id,
          Name: subj.subject_name,
          Description: subj.description,
          Image: subj.image_url,
          // Placeholder values for Grade, Classes, and Teachers
          Subject_Id: subj.subject_id, // replace with real data if available
          // Classes: [],      // replace with subj.classes if included in API
          // Teachers: []      // replace with subj.teachers if included in API
        }));
        setSubjects(formatted);
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: formatted }));
        toast.success("Subjects loaded successfully", { id: toastId });
      } else {
        toast.error(result.message || "Failed to load subjects", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching subjects", { id: toastId });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(sbj =>
    sbj.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sbj.ID.toString().includes(searchQuery)
  );

  const handleEditClick = (sbj) => {
    navigate(`/admin/subjects/edit/${sbj.ID}`, { state: { sbj } });
  };

  const handleAddClick = () => {
    navigate(`/admin/subjects/add`);
  };

  const confirmDelete = async () => {
    const toastId = toast.loading("Deleting subject...");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/${selectedSubject.ID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("Subject deleted", { id: toastId });
        localStorage.removeItem("subjects_cache");
        fetchSubjects(true);
      } else {
        const result = await res.json();
        toast.error(result.message || "Failed to delete subject", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting", { id: toastId });
    } finally {
      setShowDeleteModal(false);
      setSelectedSubject(null);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType="admin" />

      <div className="w-4/5 flex flex-col items-center">
        <div className="w-4/5 flex items-center justify-between text-blk h-16 p-2 m-4">
          <p className="text-3xl text-main">Subjects</p>
          <div>
            <button
              onClick={() => fetchSubjects(true)}
              className="bg-gray-300 rounded-md text-black px-3 py-2 hover:bg-gray-400 m-2 hover:cursor-pointer"
            >
              Refresh
            </button>
            <button
              className="bg-main rounded-md text-white p-2 hover:bg-main2 hover:cursor-pointer"
              onClick={handleAddClick}
            >
              Add Subject
            </button>
          </div>
        </div>

        <div className="w-4/5">
          <div className="flex items-center justify-center text-blk ">
            <div className="rounded-lg bg-gray-200 p-1.5 w-full">
              <div className="flex">
                <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute w-5 fill-gray-500 transition">
                    <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
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
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Subject ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredSubjects.map(sbj => (
                  <tr key={sbj.ID}>
                    <td className="py-2 px-4 border-b">{sbj.ID}</td>
                    <td className="py-2 px-4 border-b">{sbj.Subject_Id}</td>
                    <td className="py-2 px-4 border-b">{sbj.Name}</td>
                    <td className="py-2 px-4 border-b max-w-36">{sbj.Description}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-main hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2"
                        onClick={() => handleEditClick(sbj)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(sbj)}
                        className="bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSubjects.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-gray-400">No subjects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showDeleteModal && selectedSubject && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the subject <strong>{selectedSubject.Name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 hover:cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:cursor-pointer"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
