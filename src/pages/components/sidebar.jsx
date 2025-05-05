import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../../assets/logo.svg';
import dashboard from '../../assets/dashboard_icon.svg';
import users from '../../assets/users.svg';
import subjects from '../../assets/subjects.svg';
import classes from '../../assets/classes.svg';
import messages from '../../assets/messages.svg';
import notifications from '../../assets/notifications.svg';
import profile from '../../assets/profile.svg';
import pfp from '../../assets/noel.jpg';

const Sidebar = ({userType}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const type = userType

  const user = {
    name: "Noel",
    role: "System Admin",
    profilePicture: pfp,
  };

  // Sidebar items with their respective paths (prepended with admin || teacher)
  const sidebarItems = [
    { icon: dashboard, text: "Dashboard", path: `/${type}/dashboard` },
    { icon: users, text: "Users", path: `/${type}/users` },
    { icon: subjects, text: "Subjects", path: `/${type}/subjects` },
    { icon: classes, text: "Classes", path: `/${type}/classes` },
    { icon: messages, text: "Messages", path: `/${type}/messages` },
    { icon: notifications, text: "Notifications", path: `/${type}/notifications` },
    { icon: profile, text: "Profile", path: `/${type}/profile` },
  ];

  // Determine the active page based on the current URL
  const activePage = sidebarItems.find((item) =>
    location.pathname.startsWith(item.path) // Check if the path starts with the item's path
  )?.text || "Dashboard";

  // Handle click on sidebar items
  const handleItemClick = (text, path) => {
    navigate(path); // Navigate to the respective path
  };

  return (
    <div className="h-screen w-1/5 bg-main flex flex-col">
      {/* Logo and Title Section */}
      <div className="flex items-center justify-evenly p-3">
        <img src={logo} className="w-12 h-12" alt="Logo" />
        <div className="flex flex-col">
          <p className="text-lg font-bold">E-t3lm</p>
          <p className="text-xs">Learning Management System</p>
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex flex-col p-4 flex-grow">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`group flex items-center p-2 m-2 rounded-md hover:bg-white hover:text-black hover:cursor-pointer transition-colors duration-200 ${
              activePage === item.text ? "bg-white text-black" : ""
            }`}
            onClick={() => handleItemClick(item.text, item.path)}
          >
            <img
              src={item.icon}
              className={`w-6 h-6 mr-4 group-hover:filter group-hover:brightness-0 ${
                activePage === item.text ? "filter brightness-0" : ""
              }`}
              alt={item.text}
            />
            <p className="text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      {/* User Section at the Bottom */}
      <div className="flex items-center p-4 border-t border-gray-200">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-400">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;