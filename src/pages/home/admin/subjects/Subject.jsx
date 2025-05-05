import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../../../components/sidebar";
import back from '../../../../assets/back.svg';

const EditSubject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sbj } = location.state || {};

  if (!sbj) {
    return <div>No subject data found.</div>;
  }

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar 
        userType={"admin"}
      />
      
      <div className="w-4/5 flex flex-col p-4 text-blk">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/subjects")}
        >
          <img src={back} className="w-5 h-5"/><p className="text-xl text-main">Back to all subjects</p>
        </button>
        <h1 className="text-3xl text-main mb-4 pl-4">Subject</h1>

        <div className="w-4/5 flex items-center justify-between pl-4 mb-4">
          <h1 className="text-2xl text-blk mb-4">{sbj.Name}</h1>
          
          <div>
            <button className="bg-main w-20 hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2">Edit</button>
            <button className="bg-red-500 w-20 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md">Delete</button>
          </div>
        </div>

        <div className="w-4/5 grid grid-cols-2">
          {Object.entries(sbj)
            .slice(1)
            .map(([key, value]) => (
            <p 
              className="bg-gray-100 p-6 rounded-lg shadow-md ml-4 mb-4 hover:cursor-pointer hover:bg-gray-300"
              key={key}>
              <strong><span className="text-main">{key}</span>:</strong>{" "}
              {Array.isArray(value) ? value.join(", ") : value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditSubject;