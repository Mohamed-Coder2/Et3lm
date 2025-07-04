import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../../assets/logo.svg';
import dashboard from '../../assets/dashboard_icon.svg';
import users from '../../assets/users.svg';
import subjects from '../../assets/subjects.svg';
import classes from '../../assets/classes.svg';
import profile from '../../assets/profile.svg';
import defaultPfp from '../../assets/default-avatar.png';
import teachers from '../../assets/teacher.png';
import calendarr from '../../assets/calendar.svg';
import parent from '../../assets/parent.svg';

const Sidebar = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = userType;

  // Safely parse stored admin data
  let parsedAdmin = null;
  try {
    const stored = localStorage.getItem('adminData');
    if (stored) parsedAdmin = JSON.parse(stored);

    // If image is a File object, discard it (not usable in <img src>)
    if (parsedAdmin && typeof parsedAdmin.image === "object") {
      parsedAdmin.image = null;
    }
  } catch (err) {
    console.warn("Invalid adminData in localStorage. Resetting...");
    localStorage.removeItem('adminData');
    parsedAdmin = null;
  }

  const user = {
    name: parsedAdmin ? `${parsedAdmin.firstName} ${parsedAdmin.lastName}` : "Unknown",
    role: type || "Admin",
    profilePicture: parsedAdmin?.image
      ? `${import.meta.env.VITE_BACKEND_URL}/storage/${parsedAdmin.image}`
      : defaultPfp,
  };

  const sidebarItems = [
    { icon: dashboard, text: "Dashboard", path: `/${type}/dashboard` },
    { icon: users, text: "Students", path: `/${type}/students` },
    { icon: teachers, text: "Teachers", path: `/${type}/teacher` },
    { icon: parent, text: "Parents", path: `/${type}/parents` },
    { icon: subjects, text: "Subjects", path: `/${type}/subjects` },
    { icon: classes, text: "Classes", path: `/${type}/classes` },
    { icon: calendarr, text: "Schedule", path: `/${type}/schedule` },
    { icon: profile, text: "Profile", path: `/${type}/profile` },
  ];

  const activePage = sidebarItems.find((item) =>
    location.pathname.startsWith(item.path)
  )?.text || "Dashboard";

  const handleItemClick = (text, path) => {
    navigate(path);
  };

  return (
    <div className="h-screen w-1/5 bg-main flex flex-col">
      {/* Logo and Title */}
      <div className="flex items-center justify-evenly p-3">
        <div className="flex flex-col">
          <img src={logo} className="w-20 md:w-30 lg:w-40 xl:w-max hover:cursor-pointer" onClick={() => {navigate(`/admin/login`)}} alt="Logo" />
          <p className="text-xs">Learning Management System</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
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

      {/* User Info */}
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
