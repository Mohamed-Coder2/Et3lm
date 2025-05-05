import React from "react";

import Sidebar from "../../../components/sidebar";

const Notifications = () => {
  return(
    <div className="w-screen h-screen bg-white">
      <Sidebar 
        userType={"admin"}
      />

    </div>
  )
}

export default Notifications;