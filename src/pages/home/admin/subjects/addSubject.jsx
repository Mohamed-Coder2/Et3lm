import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/sidebar";
import back from '../../../../assets/back.svg';

const AddSubject = () => {
  const navigate = useNavigate();

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return(
    <div className="w-screen h-screen flex bg-white">
      <Sidebar 
        userType={"admin"}
      />

      <div className="w-4/5 flex flex-col p-4 text-blk">
        <button
          className="w-60 hover:cursor-pointer flex items-center justify-between p-2 hover:underline"
          onClick={() => navigate("/admin/subjects")} // Navigate back to the users page
        >
          <img src={back} className="w-5 h-5"/><p className="text-xl text-main">Back to all subjects</p>
        </button>
        <h1 className="text-3xl text-main mb-4 pl-4">Add Subject</h1>

        <div>
          <div className="flex p-4 items-center justify-center">
            <div className="flex p-4 items-center justify-center">
              <div className="m-4 bg-main p-4 rounded-lg shadow-md">
                <label htmlFor="inputname" className="block text-white font-semibold text-sm">
                  Subject ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="inputname"
                    placeholder="CS101"
                    className="block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
                  />
                </div>
              </div>
              <div className="m-4 bg-main p-4 rounded-lg shadow-md">
                <label htmlFor="inputname" className="block text-white font-semibold text-sm">
                  Subject Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="inputname"
                    placeholder="Computer Science"
                    className="block w-56 rounded-md py-1.5 px-2 bg-white text-blk focus:ring-2 focus:ring-main2 focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center p-4">
            <div className="bg-main w-1/4 mr-4 p-4 rounded-lg shadow-md">
              <label htmlFor="cars" className="text-white font-semibold mb-2 block">
                Grade
              </label>
              <select
                name="cars"
                id="cars"
                className="w-full p-2 rounded-md border border-main2 bg-white text-blk focus:outline-none focus:ring-2 focus:ring-main2"
              >
                <option value="volvo">Grade 10</option>
                <option value="saab">Grade 11</option>
                <option value="mercedes">Grade 12</option>
              </select>
            </div>

            <MultiSelectDropdown label="Classes" options={["1A", "1B", "2A", "2B", "3A", "3B"]} />
            <MultiSelectDropdown label="Teachers" options={["Mohamed Emad", "Jane Smith", "John Doe"]} />

          </div>
          <div className="flex items-center justify-center p-4">
            <div className="mr-4">
              <button className="w-20 bg-main hover:bg-main2 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors">
                Save
              </button>
            </div>
            <div>
              <button className="w-20 bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-2 py-1 rounded-md shadow-md transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MultiSelectDropdown = ({ options, label }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <div className="relative bg-main w-1/4 p-4 rounded-lg shadow-md mr-4">
      <label className="text-white font-semibold mb-2 block">{label}</label>
      <div
        className="w-full p-2 rounded-md border border-main2 bg-white text-blk focus:outline-none focus:ring-2 focus:ring-main2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? selectedOptions.join(", ") : "Select options"}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-main2 rounded-md mt-1 shadow-lg">
          {options.map((option) => (
            <label
              key={option}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddSubject;