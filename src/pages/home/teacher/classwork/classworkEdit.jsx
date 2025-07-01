import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/teacherBar";
import back from '../../../../assets/back.svg';
import { useEffect, useRef, useState } from 'react';
import { useUser } from "../../../../userContext";
import { toast } from 'react-hot-toast';

import {
  StreamTab,
  HomeworkTab,
  QuizzesTab,
  StudentsTab
} from './classworkTabs';

const ClassWorkEdit = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Stream");
  const subjectData = state?.subjectData;

  const { user, loading } = useUser();

  // Tab component mapping
  const tabComponents = {
    Stream: StreamTab,
    Homework: HomeworkTab,
    Quizzes: QuizzesTab,
    Students: StudentsTab
  };

  // Get current tab component
  const CurrentTab = tabComponents[activeTab];
  const toastId = useRef(null);

  useEffect(() => {
    if (loading && !toastId.current) {
      toastId.current = toast.loading("Loading user...");
    }

    if (!loading && toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }
  }, [loading]);

  if (loading) return null;

  if (!user) {
    toast.error("User not found");
    return null;
  }

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden">
      <Sidebar userType={"teacher"} />

      <div className="w-4/5 flex flex-col items-center">
        {subjectData ? (
          <div className="w-full h-full text-blk">
            <div className="p-4">
              <button
                className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
                onClick={() => navigate("/teacher/classwork")}
              >
                <img src={back} className="w-5 h-5" />
                <p className="text-xl text-main">Back to all subjects</p>
              </button>
              <h1 className="text-3xl text-main ml-1.5">
                {subjectData.name} - {subjectData.subject_id}
              </h1>
            </div>

            <div className="">
              <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
              <div
                className="overflow-auto
                  h-[calc(100vh-80px)]      /* default */
                  sm:h-[calc(100vh-100px)]   /* small screens */
                  md:h-[calc(100vh-130px)]   /* medium screens */
                  lg:h-[calc(100vh-150px)]   /* large screens */
                  xl:h-[calc(100vh-165px)]   /* extra large screens */
              ">
                <CurrentTab subjectData={subjectData} user={user} />
              </div>
            </div>
          </div>
        ) : (
          <p>No subject data found</p>
        )}
      </div>
    </div>
  );
};

const Nav = ({ activeTab, setActiveTab }) => {
  const tabs = ["Stream", "Homework", "Quizzes", "Students"];

  const today = new Date();
  const day = today.getDate();
  const fullDate = today.toLocaleDateString("en-GB");

  return (
    <div className="w-full flex flex-wrap items-center justify-between border-b-2 px-2 sm:px-4 py-2 sm:pb-2">
      {/* Tabs Section */}
      <div className="w-full sm:w-2/3 flex flex-wrap sm:flex-nowrap justify-center sm:justify-evenly gap-2 sm:gap-0 text-main">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`cursor-pointer px-3 sm:px-4 py-1 sm:py-2 rounded-t-lg text-sm sm:text-base ${activeTab === tab
              ? "font-bold text-main2 border-b-2 border-main2"
              : "hover:text-main2"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-2 sm:mt-0 pr-2 sm:pr-4 group relative cursor-default">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-main2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#555" fill="#fff" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="#555" />
          <line x1="8" y1="2" x2="8" y2="6" stroke="#555" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="#555" />
          <text
            x="12"
            y="20"
            textAnchor="middle"
            fontSize="10"
            className="font-extralight text-main"
          >
            {day}
          </text>
        </svg>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
          {fullDate}
        </div>
      </div>

    </div>
  );
};


export default ClassWorkEdit;