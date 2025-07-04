import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../../../components/sidebar";

const CACHE_KEY = "classes_cache";
const CACHE_TIME_LIMIT = 1000 * 60 * 60; // 1 hour in ms

const Classes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCachedData = () => {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    const parsed = JSON.parse(cache);
    const isExpired = Date.now() - parsed.timestamp > CACHE_TIME_LIMIT;
    return isExpired ? null : parsed.data;
  };

  const fetchClasses = async ({ force = false } = {}) => {
    if (!force) {
      const cached = getCachedData();
      if (cached) {
        setClasses(cached);
        return;
      }
    }

    setLoading(true);
    const toastId = toast.loading("Fetching classes...");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "ngrok-skip-browser-warning": "true"
        },
      });

      if (!res.ok) throw new Error("Failed to fetch classes");

      const result = await res.json();
      const fetchedClasses = result.data?.classes || [];

      setClasses(fetchedClasses);
      localStorage.setItem("totalClasses", fetchedClasses.length);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: fetchedClasses, timestamp: Date.now() })
      );

      toast.success("Classes loaded", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Error loading classes", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClick = () => navigate("/admin/classes/add");

  const handleEditClick = (cls) => {
    navigate(`/admin/classes/edit/${cls.id}`, { state: { cls } });
  };

  const filteredClasses = classes.filter((cls) =>
    cls.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.id.toString().includes(searchQuery)
  );

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType="admin" />
      <div className="w-4/5 flex flex-col items-center overflow-y-auto">
        <div className="w-4/5 flex items-center justify-between text-blk h-16 p-2 m-4">
          <p className="text-3xl text-main">Classes</p>
          <div className="flex gap-2">
            <button
              className="bg-gray-500 rounded-md text-white p-2 hover:bg-gray-600 hover:cursor-pointer"
              onClick={() => fetchClasses({ force: true })}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              className="bg-main rounded-md text-white p-2 hover:bg-main2 hover:cursor-pointer"
              onClick={handleAddClick}
            >
              Add Class
            </button>
                        <button
              className="bg-main rounded-md text-white p-2 hover:bg-main2 hover:cursor-pointer"
              onClick={() => navigate('/admin/classes/assign')}
            >
              Assign Subject to Class
            </button>
          </div>
        </div>

        <div className="w-4/5">
          <div className="flex items-center justify-center text-blk mb-4">
            <div className="rounded-lg bg-gray-200 p-1.5 w-full">
              <div className="flex">
                <div className="flex w-10 items-center justify-center border-r border-gray-200 bg-white p-5">
                  <svg viewBox="0 0 20 20" className="w-5 fill-gray-500">
                    <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                  </svg>
                </div>
                <input
                  name="search"
                  type="text"
                  className="p-2 w-full bg-white text-base font-semibold outline-0"
                  placeholder="Search by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 text-blk overflow-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Students</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredClasses.map((cls) => (
                  <tr key={cls.id}>
                    <td className="py-2 px-4 border-b">{cls.id}</td>
                    <td className="py-2 px-4 border-b">{cls.class_name}</td>
                    <td className="py-2 px-4 border-b">
                      {cls.numberOfStudents ?? 0}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-main hover:bg-main2 text-white px-2 py-1 rounded-md mr-2"
                        onClick={() => handleEditClick(cls)}
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClasses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-gray-400 italic">
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
