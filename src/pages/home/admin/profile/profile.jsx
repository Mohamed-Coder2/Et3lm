import React from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/sidebar";
import pfp from '../../../../assets/noel.jpg';

const Profile = () => {
  const navigate = useNavigate();

  const user = {
    Pfp: pfp,
    ID: "AD3024982387",
    Name: "Noel",
    Role: "System Admin",
    Nationality: "Egyptian"
  };

  return(
    <div className="w-screen h-screen flex bg-white">
      <Sidebar 
        userType={"admin"}
      />

      <div className="w-4/5 flex flex-col p-4 text-blk">
        <h1 className="text-3xl text-main ml-4 mb-4">Profile</h1>

        <div className="w-4/5 flex items-center justify-between">
          <div className="flex items-center p-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
              <img
                src={user.Pfp}
                alt="Profile"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <p className="text-2xl text-main font-extrabold">{user.Name}</p>
              <p className="text-gray-400">{user.Role}</p>
            </div>
          </div>
          
          <div>
            <button className="bg-main w-20 hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2">Edit</button>
          </div>
        </div>

        <div className="w-4/5 grid grid-cols-2">
          {Object.entries(user)
            .slice(1) // Removes Fields (ID, Pfp)
            .map(([key, value]) => (
            <p 
              className="bg-gray-100 p-6 rounded-lg shadow-md ml-4 mb-4 hover:cursor-pointer hover:bg-gray-300"
              key={key}>
              <strong><span className="text-main">{key}:</span></strong>{" "}
              {Array.isArray(value) ? value.join(", ") : value}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile;