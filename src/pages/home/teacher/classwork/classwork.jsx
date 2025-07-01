import { useEffect, useState } from "react";
import Sidebar from "../../../components/teacherBar";
import { useNavigate } from "react-router-dom";

const mock_Data = [
  {
    id: '1',
    name: 'English',
    subject_id: 'EN-212',
    description: 'English course',
    logo: 'hehe'
  }
]

const ClassWork = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`, {
          headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true"
          }
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const raw = await res.text();
          throw new Error(`Expected JSON, got:\n${raw}`);
        }

        const data = await res.json();

        if (data.success) {
          const formattedSubjects = data.data.map(subject => ({
            id: subject.id,
            name: subject.subject_name,
            subject_id: subject.subject_id,
            description: subject.description,
            logo: subject.image_url
          }));

          setSubjects(formattedSubjects);
        }

      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);


  const handleSubjectClick = (subject) => {
    navigate(`/teacher/classwork/${subject.id}`, { state: { subjectData: subject } });
  };

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden">
      <Sidebar userType={"teacher"} />

      <div className="w-4/5 flex flex-col items-center">
        <div className="w-full m-4">
          <h1 className="m-4 p-2 text-3xl text-main">Classwork</h1>
        </div>

        <div className="w-full p-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            // change mock_Data to subjects
            subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => handleSubjectClick(subject)}
                className="cursor-pointer"
              >
                <Subj
                  name={subject.name}
                  subject_id={subject.subject_id}
                  description={subject.description}
                  logo={subject.logo}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Subj = ({ name, subject_id, description, logo }) => {
  return (
    <div className="flex items-center justify-between rounded-lg text-white bg-main2 hover:bg-main">
      <div className="p-2 flex flex-col justify-evenly h-full">
        <div className="flex flex-col p-2">
          <p className="font-bold text-lg">{name}</p>
          <p className="text-gray-300">{subject_id}</p>
        </div>
        <p className="p-2">{description}</p>
      </div>
      <img
        src={logo}
        className="w-1/2 h-full object-cover"
        alt={`${name} logo`}
      />
    </div>
  );
};


export default ClassWork;