import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

import Sidebar from "../../../components/sidebar";
import back from "../../../../assets/back.svg";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {}; // expects user.email + firebase_uid
  const [studentId, setStudentId] = useState(null); // ← backend DB id

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    class_id: "",
  });

  const [classes, setClasses] = useState([]);

  const token = localStorage.getItem("adminToken");

  // Fetch student info by email
  useEffect(() => {
    const loadStudent = async () => {
      const toastId = toast.loading("Loading student info...");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/students/by-email`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({ email: user.email }),
          }
        );

        const result = await res.json();
        if (res.ok && result.success) {
          const s = result.data.student;
          setStudentId(s.id); // ← save backend student ID here
          setForm({
            first_name: s.first_name || "",
            last_name: s.last_name || "",
            email: s.email || "",
            password: "",
            class_id: s.class_id || "",
          });
          toast.dismiss(toastId);
        } else {
          toast.error("Failed to fetch student info", { id: toastId });
        }
      } catch (error) {
        toast.error("Error loading student data", { id: toastId });
      }
    };

    if (user?.email) loadStudent();
  }, [user, token]);

  // Fetch class list
  useEffect(() => {
    const loadClasses = async () => {
      const toastId = toast.loading("Loading classes...");
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });
        const result = await res.json();
        if (res.ok && result.success) {
          setClasses(result.data.classes);
          toast.dismiss(toastId);
        } else {
          toast.error("Failed to fetch classes", { id: toastId });
        }
      } catch (error) {
        toast.error("Error loading classes", { id: toastId });
      }
    };

    loadClasses();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating student...");

    try {
      const updatedFields = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        class_id: form.class_id || null,
      };

      if (form.password.trim() !== "") {
        updatedFields.password = form.password;
      }

      // 1. Update backend
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/students/${studentId}`, // ← correct backend ID
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        // 2. Update Firestore if UID exists
        if (user.firebase_uid) {
          await updateDoc(doc(db, "students", user.firebase_uid), {
            "class-id": form.class_id || null,
          });
        }

        toast.success("Student updated successfully!", { id: toastId });
      } else {
        toast.error(result.message || "Update failed", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during update", { id: toastId });
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType="admin" />

      <div className="w-4/5 flex flex-col p-4 text-blk">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/students")}
        >
          <img src={back} className="w-5 h-5" />
          <p className="text-xl text-main">Back to all users</p>
        </button>

        <h1 className="text-3xl text-main mb-4">Edit Student</h1>

        <div className="w-4/5 flex items-center justify-between">
          <div className="flex items-center p-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-4 bg-gray-200">
              <div className="flex items-center justify-center h-full text-gray-500">
                No Image
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-extrabold">
                {form.first_name} {form.last_name}
              </p>
              <p className="text-blk/60">Student</p>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-main w-20 hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2"
          >
            Save
          </button>
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
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Leave blank to keep unchanged"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Class</label>
            <select
              name="class_id"
              value={form.class_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Unassigned</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} (Students: {cls.numberOfStudents})
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;