import React from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/sidebar";
import back from '../../../../assets/back.svg'

const Addclass = () => {
  const navigate = useNavigate();

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

        <div>
          <div className="flex p-4 items-center justify-center">
            <div className="flex p-4 items-center justify-center">
              <div className="m-4 bg-main p-4 rounded-lg shadow-md">
                <label htmlFor="inputname" className="block text-white font-semibold text-sm">
                  Class ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="inputname"
                    placeholder="SEC-1A "
                    className="block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
                  />
                </div>
              </div>
              <div className="m-4 bg-main p-4 rounded-lg shadow-md">
                <label htmlFor="inputname" className="block text-white font-semibold text-sm">
                  Class Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="inputname"
                    placeholder="Secondary 1A"
                    className="block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center p-4">
            <div className="bg-main w-1/4 mr-4 p-4 rounded-lg shadow-md">
              <label htmlFor="cars" className="text-white font-semibold mb-2 block">
                Students List
              </label>
              <select
                name="cars"
                id="cars"
                className="w-full p-2 rounded-md border border-main2 bg-white text-blk focus:outline-none focus:ring-2 focus:ring-main2"
              >
                <option value="volvo">Abdo</option>
                <option value="saab">Emad</option>
                <option value="mercedes">Mohamed</option>
              </select>
            </div>

            <div className="bg-main w-1/4 mr-4 p-4 rounded-lg shadow-md">
              <label htmlFor="cars" className="text-white font-semibold mb-2 block">
                Teachers List
              </label>
              <select
                name="cars"
                id="cars"
                className="w-full p-2 rounded-md border border-main2 bg-white text-blk focus:outline-none focus:ring-2 focus:ring-main2"
              >
                <option value="volvo">John Doe</option>
                <option value="saab">jane Smith</option>
              </select>
            </div>

            <div className="bg-main w-1/4 p-4 rounded-lg shadow-md">
              <label htmlFor="cars" className="text-white font-semibold mb-2 block">
                Subjects List
              </label>
              <select
                name="cars"
                id="cars"
                className="w-full p-2 rounded-md border border-main2 bg-white text-blk focus:outline-none focus:ring-2 focus:ring-main2"
              >
                <option value="volvo">Distributed Systems</option>
                <option value="saab">Calculus</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center p-4">
            <div className="mr-4">
              <button className="w-20 bg-main hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors">
                Save
              </button>
            </div>
            <div>
              <button className="w-20 bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Addclass;