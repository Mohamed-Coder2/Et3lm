import { useState } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "../../../components/sidebar";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useNavigate } from "react-router-dom";
import back from '../../../../assets/back.svg'

export default function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating student...");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Unauthorized: No token found", { id: toastId });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Student added successfully!", { id: toastId });
        
        // 🧾 Log to Firestore
        const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
        await setDoc(doc(collection(db, "adminLogs")), {
          action: "add_student",
          timestamp: serverTimestamp(),
          performedBy: {
            email: adminData.email || "unknown",
            name: `${adminData.firstName || ""} ${adminData.lastName || ""}`.trim(),
            image: adminData.image || "",
          },
          studentEmail: form.email,
          studentName: `${form.first_name} ${form.last_name}`.trim(),
        });

        setForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          image: null,
        });
        setPreview(null);
      } else {
        toast.error(result.message || "Failed to add student", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred while adding the student", { id: toastId });
    }
  };

  return (
    <div className="flex w-full bg-white">
      <Sidebar />

      <div className="flex flex-col w-full">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/students")} // Navigate back to the users page
        >
          <img src={back} className="w-5 h-5" /><p className="text-xl text-main">Back to all users</p>
        </button>

        <div className="w-2/5 mx-auto p-6 bg-blk rounded-xl shadow-md mt-10">

          <h2 className="text-2xl font-semibold mb-4 text-center">Add Student</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Profile Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 h-24 w-24 object-cover rounded-full"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Add Student
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
