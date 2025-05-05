import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../../../components/sidebar";
import back from '../../../../assets/back.svg'

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {}; // Retrieve the user data from the state

  if (!user) {
    return <div>No user data found.</div>;
  }

  console.log(user.Pfp)

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar 
        userType={"admin"}
      />
      
      <div className="w-4/5 flex flex-col p-4 text-blk">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/users")} // Navigate back to the users page
        >
          <img src={back} className="w-5 h-5"/><p className="text-xl text-main">Back to all users</p>
        </button>
        <h1 className="text-3xl text-main mb-4">User</h1>

        <div className="w-4/5 flex items-center justify-between">
          <div className="flex items-center p-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
              <img
                src={user.Pfp}
                alt="Profile"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <p className="text-xl font-extrabold">{user.Name}</p>
          </div>
          
          <div>
            <button className="bg-main w-20 hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2">Edit</button>
            <button className="bg-red-500 w-20 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md">Delete</button>
          </div>
        </div>

        <div className="w-4/5 grid grid-cols-2">
          {Object.entries(user)
            .slice(2) // Removes Fields (ID, Pfp)
            .map(([key, value]) => (
            <p 
              className="bg-gray-100 p-6 rounded-lg shadow-md ml-4 mb-4 hover:cursor-pointer hover:bg-gray-300"
              key={key}>
              <strong>{key}:</strong>{" "}
              {Array.isArray(value) ? value.join(", ") : value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditUser;