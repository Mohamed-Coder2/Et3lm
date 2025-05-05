import React from "react";
import Sidebar from "../../../components/sidebar";
import { useNavigate } from "react-router-dom";

const Subjects = () => {
  const demoSubjects = [
    {
      ID: 1,
      Name: "Calculus",
      Grade: "Secondary 3",
      Classes: ["3A", "3B"],
      Teachers: ["John Doe", "Jane Smith"]
    },
    {
      ID: 2,
      Name: "Problem Solving",
      Grade: "Secondary 2",
      Classes: ["2A", "2B"],
      Teachers: ["John Doe", "Jane Smith"]
    },
    {
      ID: 3,
      Name: "Distributed Systems",
      Grade: "Secondary 1",
      Classes: ["1A", "1B"],
      Teachers: ["John Doe", "Jane Smith"]
    }
  ];

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter subjects based on search query (name or ID)
  const filteredSubjects = demoSubjects.filter(sbj => {
    return (
      sbj.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sbj.ID.toString().includes(searchQuery)
    );
  });

  const handleEditClick = (sbj) => {
    navigate(`/admin/subjects/edit/${sbj.ID}`, { state: { sbj } });
  };

  const handleAddClick = () => {
    navigate(`/admin/subjects/add`);
  }

  return (
    <div className="w-screen h-screen flex bg-white">
      <Sidebar 
        userType={"admin"}
      />

      <div className="w-4/5 flex flex-col items-center">
        <div className="w-4/5 flex items-center justify-between text-blk h-16 p-2 m-4">
          <p className="text-3xl text-main">Subjects</p>
          <button 
            className="bg-main rounded-md text-white p-2 hover:bg-main2 hover:cursor-pointer"
            onClick={() => {handleAddClick()}}
          >Add Subject</button>
        </div>

        <div className="w-4/5">
          <div className="flex items-center justify-center text-blk ">
            <div className="rounded-lg bg-gray-200 p-1.5 w-full">
              <div className="flex">
                <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute w-5 fill-gray-500 transition">
                    <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                  </svg>
                </div>
                <input
                  name="search"
                  id="search"
                  type="text"
                  className="p-2 w-full bg-white text-base font-semibold outline-0"
                  placeholder="Search by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 text-blk">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Grade</th>
                  <th className="py-2 px-4 border-b">Teachers</th>
                  <th className="py-2 px-4 border-b">Classes</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredSubjects.map(sbj => (
                  <tr key={sbj.ID}>
                    <td className="py-2 px-4 border-b">{sbj.ID}</td>
                    <td className="py-2 px-4 border-b">{sbj.Name}</td>
                    <td className="py-2 px-4 border-b">{sbj.Grade}</td>
                    <td className="py-2 px-4 border-b max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {sbj.Teachers.join(", ")}
                    </td>
                    <td className="py-2 px-4 border-b max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {sbj.Classes.join(", ")}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-main hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md mr-2"
                        onClick={() => handleEditClick(sbj)}
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;