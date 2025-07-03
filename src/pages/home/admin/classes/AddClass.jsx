import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../../../components/sidebar";
import back from '../../../../assets/back.svg'

const Addclass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    class_number: "",
    class_name: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating class...");
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.class_number.trim() || !formData.class_name.trim()) {
        throw new Error("Please fill in all fields");
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
          class_number: formData.class_number,
          class_name: formData.class_name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create class");
      }

      const data = await response.json();
      toast.success("Class created successfully!", { id: loadingToast });
      navigate("/admin/classes"); // Redirect after success
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: loadingToast });
      console.error("Error creating class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/classes");
  };

  return(
    <div className="w-screen h-screen flex bg-white">
      <Sidebar 
        userType={"admin"}
      />

      <div className="w-4/5 flex flex-col p-4 text-blk">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/classes")}
        >
          <img src={back} className="w-5 h-5"/><p className="text-xl text-main">Back to all classes</p>
        </button>
        <h1 className="text-3xl text-main mb-4 pl-4">Add Class</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex p-4 items-center justify-center">
            <div className="flex p-4 items-center justify-center">
              <div className="m-4 bg-main p-4 rounded-lg shadow-md">
                <label htmlFor="class_number" className="block text-white font-semibold text-sm">
                  Class Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="class_number"
                    id="class_number"
                    value={formData.class_number}
                    onChange={handleInputChange}
                    placeholder="SEC-1A"
                    className="block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
                    required
                  />
                </div>
              </div>
              <div className="m-4 bg-main p-4 rounded-lg shadow-md">
                <label htmlFor="class_name" className="block text-white font-semibold text-sm">
                  Class Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="class_name"
                    id="class_name"
                    value={formData.class_name}
                    onChange={handleInputChange}
                    placeholder="Secondary 1A"
                    className="block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center p-4">
            <div className="mr-4">
              <button 
                type="submit" 
                className="w-20 bg-main hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
            <div>
              <button 
                type="button"
                onClick={handleCancel}
                className="w-20 bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Addclass;