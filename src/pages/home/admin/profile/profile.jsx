import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../../../components/sidebar";
import defaultPfp from '../../../../assets/default-avatar.png';

const Profile = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: ""
  });
  const [editingFields, setEditingFields] = useState({});
  const [imagePreview, setImagePreview] = useState(defaultPfp);

  useEffect(() => {
    const stored = localStorage.getItem("adminData");
    if (stored) {
      const admin = JSON.parse(stored);
      setAdminId(admin.id);
      setFormData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: "", // Leave empty unless changed
        image: admin.image || ""
      });
      setImagePreview(admin.image);
    }
  }, []);

  const handleFieldClick = (field) => {
    setEditingFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update image preview when image URL changes
    if (name === "image") {
      setImagePreview(value || defaultPfp);
    }
  };

  const handleApplyChanges = async () => {
    if (!adminId) return;

    const loadingId = toast.loading("Applying changes...");

    try {
      const form = new FormData();
      form.append("firstName", formData.firstName || "");
      form.append("lastName", formData.lastName || "");
      form.append("email", formData.email || "");
      if (formData.password && formData.password.length >= 6) {
        form.append("password", formData.password);
      }
      form.append("image", formData.image || "");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admins/${adminId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update profile.");
      }

      localStorage.setItem("adminData", JSON.stringify(data.data.admin));
      toast.success("Profile updated successfully!", { id: loadingId });
      setEditingFields({});
    } catch (err) {
      toast.error(`Update failed: ${err.message}`, { id: loadingId });
      console.error(err);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType={"admin"} />

      <div className="w-4/5 flex flex-col p-4 text-blk">
        <h1 className="text-3xl text-main ml-4 mb-4">Profile</h1>

        <div className="w-4/5 flex items-center justify-between">
          <div className="flex items-center p-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = defaultPfp; // Fallback to default if image fails to load
                }}
              />
            </div>
            <div>
              <p className="text-2xl text-main font-extrabold">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-gray-400">System Admin</p>
            </div>
          </div>
        </div>

        <div className="w-4/5 grid grid-cols-2 gap-4 mt-6">
          {["firstName", "lastName", "email", "password", "image"].map((field) => (
            <div
              key={field}
              className="bg-gray-100 p-6 rounded-lg shadow-md ml-4 mb-4"
              onClick={() => handleFieldClick(field)}
            >
              <label className="text-main font-semibold block mb-1 capitalize">
                {field === "image" ? "Profile Picture URL" : field}
              </label>
              {editingFields[field] ? (
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  placeholder={
                    field === "image" 
                      ? "Enter image URL" 
                      : `Enter ${field}`
                  }
                />
              ) : (
                <p className="text-gray-700 break-words">
                  {field === "image"
                    ? formData.image || "Click to add image URL"
                    : field === "password"
                      ? "••••••••" // Show dots for password
                      : formData[field] || "Click to edit"}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="ml-4">
          <button
            onClick={handleApplyChanges}
            className="bg-main text-white px-6 py-2 rounded-md hover:bg-main2 transition"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;