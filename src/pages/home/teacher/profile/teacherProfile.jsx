import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/teacherBar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import toast from "react-hot-toast";
import { useUser } from "../../../../userContext";
import default_logo from '../../../../assets/default-avatar.png';

const TeacherProfile = () => {
  const { user, loading } = useUser(); // <-- only this
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) setFormData(user); // since 'user' IS the profile now
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const savingToast = toast.loading("Saving changes...");
    try {
      // Step 1: Update Firestore
      const docRef = doc(db, "teachers", user.id);
      await updateDoc(docRef, formData);

      // Step 2: Get backend teacher ID by email
      const backendBase = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${backendBase}/api/teachers/by-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const result = await res.json();
      if (!result.success) throw new Error("Failed to fetch teacher ID from backend");

      const teacherId = result.data.id;

      // Step 3: Prepare backend update payload (exclude image)
      const [first_name = "", last_name = ""] = (formData.name || "").split(" ");
      const updateForm = new FormData();
      if (first_name) updateForm.append("first_name", first_name);
      if (last_name) updateForm.append("last_name", last_name);
      if (formData.email) updateForm.append("email", formData.email);

      // Step 4: Send update to backend
      await fetch(`${backendBase}/api/teachers/${teacherId}`, {
        method: "POST",
        body: updateForm,
      });

      toast.success("Profile updated successfully!", { id: savingToast });
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.", { id: savingToast });
    }
  };

  if (loading) {
    toast.loading("Loading profile...");
    return null;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar userType="teacher" />
      <div className="p-6 w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Teacher Profile</h2>

        <div className="text-blk space-y-6 bg-white p-6 rounded-2xl shadow">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
              />
            ) : (
              <p className="text-gray-800">{user.name || "N/A"}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-800">{user.email}</p>
          </div>

          {/* Teacher ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
            <p className="text-gray-800">{user.teacher_id}</p>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
            <p className="text-gray-800">{user.subjects?.join(", ") || "None"}</p>
          </div>

          {/* Classes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classes</label>
            <p className="text-gray-800">{user.classes?.join(", ") || "None"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
            {editing ? (
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture || ""}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
                placeholder="https://example.com/your-image.jpg"
              />
            ) : (
              <img
                src={user.profilePicture || default_logo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
          </div>

          {/* Buttons */}
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition hover:cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition hover:cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition hover:cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
