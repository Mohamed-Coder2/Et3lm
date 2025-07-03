import { useEffect, useState } from "react";
import Sidebar from "../../../components/teacherBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ClassWork = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherAssignments = async () => {
      try {
        // Get teacher data from localStorage
        const teacherData = JSON.parse(localStorage.getItem("teacherData"));
        if (!teacherData?.id) {
          throw new Error("Teacher data not found");
        }

        // Fetch teacher's assignments
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/class-subjects/teachers/${teacherData.id}/assignments`,
          {
            headers: {
              "Accept": "application/json",
              "ngrok-skip-browser-warning": "true"
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }

        const data = await response.json();
        setAssignments(data.assignments || []);

      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        toast.error("Failed to load your assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAssignments();
  }, []);

  const handleAssignmentClick = (assignment) => {
    navigate(`/teacher/classwork/${assignment.subject_id}`, { 
      state: { 
        assignmentData: assignment,
        teacherClasses: assignments.map(a => ({
          classId: a.class_id,
          className: a.class_name
        }))
      } 
    });
  };

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden">
      <Sidebar userType={"teacher"} />

      <div className="w-4/5 flex flex-col items-center">
        <div className="w-full m-4">
          <h1 className="m-4 p-2 text-3xl text-main">Classwork Assignments</h1>
        </div>

        <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
          {loading ? (
            <p>Loading your assignments...</p>
          ) : assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div
                key={`${assignment.class_id}-${assignment.subject_id}`}
                onClick={() => handleAssignmentClick(assignment)}
                className="cursor-pointer"
              >
                <AssignmentCard
                  className={assignment.class_name}
                  subjectName={assignment.subject_name}
                  subjectDescription={assignment.subject_description}
                />
              </div>
            ))
          ) : (
            <p>No assignments found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignmentCard = ({ className, subjectName, subjectDescription }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg text-main">{subjectName}</h3>
          <p className="text-gray-600 text-sm">{className} Class</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
          Active
        </div>
      </div>
      <p className="mt-2 text-gray-700 text-sm">{subjectDescription}</p>
      <div className="mt-4 flex justify-end">
        <button className="text-sm text-blue-600 hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ClassWork;