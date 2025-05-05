import React from "react";

export const QuizTable = ({ data }) => {
  return (
    <div className="bg-gray-300 rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
      <table className="w-full table-auto text-left text-black">
        <thead>
          <tr className="text-main2">
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Lesson</th>
            <th className="px-4 py-3">Issues Date</th>
            <th className="px-4 py-3">Deadline</th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3">{row.unit}</td>
              <td className="px-4 py-3">{row.lesson}</td>
              <td className="px-4 py-3">{row.issueDate}</td>
              <td className="px-4 py-3">{row.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const HWTable = ({ data }) => {
  return (
    <div className="bg-gray-300 rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
      <table className="w-full table-auto text-left text-black">
        <thead>
          <tr className="text-main2">
            <th className="px-4 py-3">Level No.</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Issues Date</th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3">{row.lvl}</td>
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3">{row.issueDate}</td>
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
            <th className="px-4 py-3">Progress</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="border-t-2 border-dashed border-gray-500">
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-gray-200">
              <td className="px-4 py-3">{row.ID}</td>
              <td className="px-4 py-3">{row.Name}</td>
              <td className="px-4 py-3">{row.Progress}</td>
              <td className="px-4 py-3 text-main cursor-pointer hover:underline">See More</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
