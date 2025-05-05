import Sidebar from "../../../components/teacherBar";
import logo from '../../../../assets/classwork.png';
import { useNavigate } from "react-router-dom";

// Mock data array
const mockSubjects = [
  {
    id: 1,
    name: "Mathematics",
    grade: "Grade 12",
    year: "Second Term - 2025",
    logo: logo
  },
  {
    id: 2,
    name: "Science",
    grade: "Grade 11",
    year: "First Term - 2025",
    logo: logo
  },
  {
    id: 3,
    name: "English",
    grade: "Grade 10",
    year: "Second Term - 2024",
    logo: logo
  },
  {
    id: 4,
    name: "History",
    grade: "Grade 9",
    year: "Second Term - 2023",
    logo: logo
  },
  {
    id: 5,
    name: "Mathematics",
    grade: "Grade 12",
    year: "Second Term - 2025",
    logo: logo
  },
  {
    id: 6,
    name: "Science",
    grade: "Grade 11",
    year: "First Term - 2025",
    logo: logo
  },
  {
    id: 7,
    name: "English",
    grade: "Grade 10",
    year: "Second Term - 2024",
    logo: logo
  },
  {
    id: 8,
    name: "History",
    grade: "Grade 9",
    year: "Second Term - 2023",
    logo: logo
  },
  {
    id: 9,
    name: "Mathematics",
    grade: "Grade 12",
    year: "Second Term - 2025",
    logo: logo
  },
  {
    id: 10,
    name: "Science",
    grade: "Grade 11",
    year: "First Term - 2025",
    logo: logo
  },
  {
    id: 11,
    name: "English",
    grade: "Grade 10",
    year: "Second Term - 2024",
    logo: logo
  },
  {
    id: 12,
    name: "History",
    grade: "Grade 9",
    year: "Second Term - 2023",
    logo: logo
  }
];

const ClassWork = () => {
  const navigate = useNavigate();

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
        <div className="w-full p-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-auto ">
          {mockSubjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject)}
              className="cursor-pointer"
            >
              <Subj
                name={subject.name}
                grade={subject.grade}
                year={subject.year}
                logo={subject.logo}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Subj = ({ name, grade, year, logo }) => {
  return (
    <div className="flex items-center justify-between rounded-lg text-white bg-main2 hover:bg-main">
      <div className="p-2 flex flex-col justify-evenly h-full">
        <div className="flex flex-col p-2">
          <p className="font-bold text-lg">{name}</p>
          <p className="text-gray-300">{grade}</p>
        </div>
        <p className="p-2">{year}</p>
      </div>
      <img
        src={logo}
        className="w-1/2 h-full"
        alt={`${name} logo`}
      />
    </div>
  )
}

export default ClassWork;