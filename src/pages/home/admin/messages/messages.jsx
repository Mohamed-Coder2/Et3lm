import React, { useState } from "react";
import Sidebar from "../../../components/sidebar";
import teacher from "../../../../assets/Teacher.jpg";
import student from "../../../../assets/chiyo.jpg";
import Chat from "./chat";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const Teachers = [
    {
      ID: 1,
      Pfp: teacher,
      Name: "John Doe",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "john.doe@example.com",
      Role: "Teacher",
      Nationality: "American",
      Classes: ["Math", "Science"],
      Subjects: ["Algebra", "Physics"],
    },
    {
      ID: 2,
      Pfp: teacher,
      Name: "Jane Smith",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "jane.smith@example.com",
      Role: "Teacher",
      Nationality: "American",
      Classes: ["Math", "Science"],
      Subjects: ["Algebra", "Physics"],
    },
    {
      ID: 3,
      Pfp: teacher,
      Name: "Alice Johnson",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "alice.johnson@example.com",
      Role: "Teacher",
      Nationality: "American",
      Classes: ["Math", "Science"],
      Subjects: ["Algebra", "Physics"],
    },
    {
      ID: 4,
      Pfp: teacher,
      Name: "Bob Brown",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "bob.brown@example.com",
      Role: "Teacher",
      Nationality: "American",
      Classes: ["Math", "Science"],
      Subjects: ["Algebra", "Physics"],
    },
  ];
  
  const Students = [
    {
      ID: 5,
      Pfp: student,
      Name: "Charlie Davis",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "charlie.davis@example.com",
      Role: "Student",
      Nationality: "British",
      Grade: "10th",
      ClassID: "A101",
      FeesDue: 0,
      OverallProgress: "85%",
    },
    {
      ID: 6,
      Pfp: student,
      Name: "Eve White",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "eve.white@example.com",
      Role: "Student",
      Nationality: "British",
      Grade: "10th",
      ClassID: "A101",
      FeesDue: 0,
      OverallProgress: "85%",
    },
    {
      ID: 7,
      Pfp: student,
      Name: "Frank Green",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "frank.green@example.com",
      Role: "Student",
      Nationality: "British",
      Grade: "10th",
      ClassID: "A101",
      FeesDue: 0,
      OverallProgress: "85%",
    },
    {
      ID: 8,
      Pfp: student,
      Name: "Grace Black",
      Text: "Hello Sir Admin",
      Date: "Today, 9:37pm",
      Email: "grace.black@example.com",
      Role: "Student",
      Nationality: "British",
      Grade: "10th",
      ClassID: "A101",
      FeesDue: 0,
      OverallProgress: "85%",
    },
  ];

  const filteredTeachers = Teachers.filter(user =>
    user.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.ID.toString().includes(searchQuery)
  );

  const filteredStudents = Students.filter(user =>
    user.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.ID.toString().includes(searchQuery)
  );

  return (
    <div className="h-screen flex bg-white">
      <Sidebar 
        userType={"admin"}
      />
      <div className="w-1/4 flex flex-col text-blk ml-4 mt-4">
        <div className="rounded-lg bg-gray-200 p-1.5 w-full">
          <input
            type="text"
            className="p-2 w-full bg-white text-base font-semibold outline-0"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-items-start h-5/6">
          {/* Teachers List */}
          <div className="mb-8">
            <h1 className="text-xl">Teachers</h1>
            <div className="shadow-blue-300 p-2 shadow-sm flex flex-col overflow-auto h-55 rounded-lg text-blk">
              {filteredTeachers.map(user => (
                <MSG key={user.ID} user={user} onClick={() => setSelectedUser(user)} />
              ))}
            </div>
          </div>

          {/* Students List */}
          <div className="">
            <h1 className="text-xl">Students</h1>
            <div className="shadow-blue-300 p-2 shadow-sm flex flex-col overflow-auto h-72 rounded-lg text-blk">
              {filteredStudents.map(user => (
                <MSG key={user.ID} user={user} onClick={() => setSelectedUser(user)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <Chat 
        User={selectedUser}
      />
    </div>
  );
};

// Message Component
const MSG = ({ user, onClick }) => {
  return (
    <div
      className="flex m-2 rounded-lg p-1 items-center justify-between hover:cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center p-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={user.Pfp} alt="Profile" className="w-full h-full object-cover object-center" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{user.Name}</p>
          <p className="text-xs text-gray-400">{user.Text}</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400">{user.Date}</p>
      </div>
    </div>
  );
};

export default Messages;