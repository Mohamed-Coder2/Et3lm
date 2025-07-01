import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Sidebar from "../../../components/sidebar";
import back from "../../../../assets/back.svg";

const EditSubject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sbj } = location.state || {};

  const [subjectId, setSubjectId] = useState(sbj?.Subject_Id || "");
  const [name, setName] = useState(sbj?.Name || "");
  const [description, setDescription] = useState(sbj?.Description || "");
  const [image, setImage] = useState(null);

  if (!sbj) {
    return <div className="p-10 text-red-500">Subject data not found.</div>;
  }

  const handleSubmit = async () => {
    if (!subjectId || !name || !description) {
      toast.error("All fields except image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("subject_id", subjectId);
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("adminToken");
    const toastId = toast.loading("Updating subject...");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/${sbj.ID}`, {
        method: "POST", // You specified POST
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to update subject");
      }

      toast.success("Subject updated successfully", { id: toastId });
      localStorage.removeItem("subjects_cache");
      navigate("/admin/subjects");
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar userType="admin" />

      <div className="w-4/5 flex flex-col p-6 text-blk overflow-y-auto">
        <button
          onClick={() => navigate("/admin/subjects")}
          className="w-60 mb-6 flex items-center gap-2 hover:underline text-main hover:cursor-pointer"
        >
          <img src={back} alt="Back" className="w-5 h-5" />
          <span className="text-xl">Back to all subjects</span>
        </button>

        <h1 className="text-3xl text-main mb-6">Edit Subject</h1>

        <div className="grid grid-cols-2 items-center justify-center">
          <div className="flex flex-col bg-main p-4 rounded-lg shadow-md w-64">
            <label className="text-white font-semibold mb-1">Subject ID</label>
            <input
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="mt-2 block w-full h-20 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
              placeholder="e.g. CS_101"
            />
          </div>

          <div className="flex flex-col bg-main p-4 rounded-lg shadow-md w-64">
            <label className="text-white font-semibold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full h-20 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="flex flex-col bg-main p-4 rounded-lg shadow-md w-64">
            <label className="text-white font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-2 block w-full h-20 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
              placeholder="Enter a short description"
            />
          </div>

          <div className="flex flex-col bg-main p-4 rounded-lg shadow-md w-64">
            <label className="text-white font-semibold mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mt-2 text-blk bg-white p-2 rounded text-sm hover:cursor-pointer w-full h-20"
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => navigate("/admin/subjects")}
            className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md transition hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-main hover:bg-main2 text-white px-6 py-2 rounded-md shadow-md transition hover:cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubject;
