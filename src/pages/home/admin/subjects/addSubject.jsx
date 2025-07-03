import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

import Sidebar from "../../../components/sidebar";
import back from '../../../../assets/back.svg';

const AddSubject = () => {
  const navigate = useNavigate();

  const [subjectId, setSubjectId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    if (!subjectId || !name || !description || !image) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("subject_id", subjectId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    const token = localStorage.getItem("adminToken");

    const toastId = toast.loading("Submitting...");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to add subject");
      }

      toast.success("Subject added successfully", { id: toastId });
      localStorage.removeItem("subjects_cache");

      // 🔒 Log the admin action to Firestore
      const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");

      await setDoc(doc(collection(db, "adminLogs")), {
        action: "add_subject",
        timestamp: serverTimestamp(),
        performedBy: {
          email: adminData.email || "unknown",
          name: `${adminData.firstName || ""} ${adminData.lastName || ""}`.trim(),
          image: adminData.image || "",
        },
        subjectId,
        subjectName: name,
      });

      navigate("/admin/subjects");
    } catch (err) {
      toast.error(err.message || "Error adding subject", { id: toastId });
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType={"admin"} />

      <div className="w-4/5 flex flex-col p-4 text-blk">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/subjects")}
        >
          <img src={back} className="w-5 h-5" /><p className="text-xl text-main">Back to all subjects</p>
        </button>
        <h1 className="text-3xl text-main mb-4 pl-4">Add Subject</h1>

        <div>
          <div className="grid grid-cols-2 p-4">
            <div className="m-4 bg-main p-4 rounded-lg shadow-md">
              <label className="block text-white font-semibold text-sm">Subject ID</label>
              <input
                type="text"
                placeholder="CS101"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-2 block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
              />
            </div>

            <div className="m-4 bg-main p-4 rounded-lg shadow-md">
              <label className="block text-white font-semibold text-sm">Subject Name</label>
              <input
                type="text"
                placeholder="Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
              />
            </div>

            <div className="m-4 bg-main p-4 rounded-lg shadow-md">
              <label className="block text-white font-semibold text-sm">Description</label>
              <textarea
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full h-20 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
              />
            </div>

            <div className="m-4 bg-main p-4 rounded-lg shadow-md">
              <label className="block text-white font-semibold text-sm">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-2 bg-white p-2 rounded text-sm hover:cursor-pointer w-full h-20"
              />
            </div>
          </div>

          <div className="flex items-center justify-center p-4">
            <div className="mr-4">
              <button
                onClick={() => navigate("/admin/subjects")}
                className="w-20 bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors"
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className="w-20 bg-main hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;
