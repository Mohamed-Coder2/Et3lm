export const QuizTable = ({ data, onViewGrades }) => {
  return (
    <div className="bg-gray-300 rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
      <table className="w-full table-auto text-left text-black">
        <thead>
          <tr className="text-main2">
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Issue Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3">{row.status}</td>
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3">{row.issueDate}</td>
              <td className="px-4 py-3">{row.time}</td>
              <td><button
                onClick={() => onViewGrades(row.id)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Grades
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const HWTable = ({ data, onViewGrades }) => {
  return (
    <div className="bg-gray-300 rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
      <table className="w-full table-auto text-left text-black">
        <thead>
          <tr className="text-main2">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Difficulty</th>
            <th className="px-4 py-3">Posted At</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3">{row.type}</td>
              <td className="px-4 py-3">{row.difficulty}</td>
              <td className="px-4 py-3">
                {row["time-posted"]?.toDate
                  ? row["time-posted"].toDate().toLocaleString()
                  : 'N/A'}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onViewGrades(row.id)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Grades
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const StuTable = ({ data }) => {
  return (
    <div className="bg-gray-300 rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
      <table className="w-full table-auto text-left text-black">
        <thead>
          <tr className="text-main2">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Class Name</th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3">{row.id}</td>
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.email}</td>
              <td className="px-4 py-3">{row.class?.class_name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TeachersTable = ({ data }) => {
  return (
    <div className="bg-gray-300 rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
      <table className="w-full table-auto text-left text-black">
        <thead>
          <tr className="text-main2">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Teacher ID</th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((teacher, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3 flex items-center gap-3">
                <img
                  src={teacher.profilePicture || "/default-pfp.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{teacher.name}</span>
              </td>
              <td className="px-4 py-3">{teacher.email}</td>
              <td className="px-4 py-3">{teacher.teacher_id || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
