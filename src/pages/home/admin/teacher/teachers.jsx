import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";
import Sidebar from "../../../components/sidebar";
import toast from "react-hot-toast";

const CreateTeacher = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateTeacherId = async () => {
    const snapshot = await getDocs(query(collection(db, "teachers")));
    const teacherCount = snapshot.size + 1;
    return `TEC-${String(teacherCount).padStart(4, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating teacher...");

    try {
      const teacher_id = await generateTeacherId();

      // Create Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // Save to Firestore with auto-generated teacher_id
      await setDoc(doc(db, "teachers", user.uid), {
        id: user.uid,
        name: form.name,
        email: form.email,
        profilePicture: form.profilePicture,
        teacher_id,
        createdAt: serverTimestamp(),
        lastLogin: null,
        classes: [],
        subjects: [],
      });

      toast.success("Teacher created successfully!", { id: loadingToast });

      setForm({
        name: "",
        email: "",
        password: "",
        profilePicture: "",
      });
    } catch (err) {
      toast.error(`Error: ${err.message}`, { id: loadingToast });
    }
  };

  return (
    <div className="flex">
      <Sidebar userType="admin" />
      <div className="w-4/5 p-8 bg-white text-blk">
        <h2 className="text-2xl font-bold mb-6">Create New Teacher</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="profilePicture"
            placeholder="Profile Picture URL"
            value={form.profilePicture}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeacher;
