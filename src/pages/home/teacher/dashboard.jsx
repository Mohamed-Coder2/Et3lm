import React from "react";
import Sidebar from "../../components/teacherBar";

import welcome from '../../../assets/Illustration.svg'

const TeacherDashboard = () => {
  return(
    <div className="h-screen flex bg-white">
      <Sidebar 
        userType={"teacher"}
      />
      <div className="flex items-center justify-evenly p-4 w-150 h-40 mt-20 ml-8 bg-gray-200 rounded-lg">
        
        <div className="text-blk p-5 flex flex-col w-full text-left">
          <p className="text-left text-3xl">Hello Teacher</p>
          <p>It's good to see you again!</p>
        </div>

        <div className=" top-0 left-0">
          <img className="absolute top-5 md:left-3/5 lg:left-1/2 xl:left-2/5" src={welcome}/>
        </div>

      </div>
    </div>
  )
}

export default TeacherDashboard;