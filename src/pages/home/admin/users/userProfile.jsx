import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Sidebar from "../../../components/sidebar";
import back from "../../../../assets/back.svg";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const [form, setForm] = useState({
    first_name: user?.FirstName || "",
    last_name: user?.LastName || "",
    email: user?.Email || "",
    class_id: user?.ClassID !== "Unassigned" ? user.ClassID : "",
  });

  if (!user) return <div>No user data found.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating user...");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Unauthorized. Admin token missing.", { id: toastId });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/students/${user.ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("User updated successfully!", { id: toastId });
      } else {
        toast.error(result.message || "Update failed.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during update.", { id: toastId });
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType={"admin"} />

      <div className="w-4/5 flex flex-col p-4 text-blk">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/students")}
        >
          <img src={back} className="w-5 h-5" />
          <p className="text-xl text-main">Back to all users</p>
        </button>

        <h1 className="text-3xl text-main mb-4">Edit User</h1>

        <div className="w-4/5 flex items-center justify-between">
          <div className="flex items-center p-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
              <img
                src={user.Pfp}
                alt="Profile"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-extrabold">{user.FirstName} {user.LastName}</p>
              <p className="text-blk/60">{user.Role}</p>
            </div>
          </div>

          <div>
            <button
              onClick={handleUpdate}
              className="bg-main w-20 hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2"
            >
              Save
            </button>
          </div>
        </div>

        <form className="w-4/5 grid grid-cols-2 gap-4 p-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Class ID</label>
            <input
              type="text"
              name="class_id"
              value={form.class_id}
              onChange={handleChange}
              placeholder="Leave empty to unassign"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;