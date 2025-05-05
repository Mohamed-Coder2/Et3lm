import React from 'react';
import { QuizTable, HWTable, StuTable } from '../../../components/table';

const sampleData = [
  { unit: "01", lesson: "aaaaa", issueDate: "15/3/2025", deadline: "15/3/2025" },
  { unit: "02", lesson: "aaaaa", issueDate: "15/3/2025", deadline: "15/3/2025" },
  { unit: "03", lesson: "aaaaa", issueDate: "15/3/2025", deadline: "15/3/2025" },
  { unit: "04", lesson: "aaaaa", issueDate: "15/3/2025", deadline: "15/3/2025" },
];

const HomeworkData = [
  { lvl: "01", title: "aaaaa", issueDate: "15/3/2025" },
  { lvl: "02", title: "aaaaa", issueDate: "15/3/2025" },
  { lvl: "03", title: "aaaaa", issueDate: "15/3/2025" },
  { lvl: "04", title: "aaaaa", issueDate: "15/3/2025" },
];

const StuData = [
  { ID: "STU-30001", Name: "Eslam", Progress: "40%" },
  { ID: "STU-30002", Name: "Mohamed", Progress: "50%" },
  { ID: "STU-30003", Name: "Youssef", Progress: "60%" },
  { ID: "STU-30004", Name: "Moaz", Progress: "70%" },
];

export const StreamTab = ({ subjectData, user }) => (
  <div className="p-4 flex flex-col items-center justify-center">
    <div className="w-2/3 h-30 flex items-center justify-between rounded-lg text-white bg-main2">
      <div className="p-2 flex flex-col justify-evenly h-full">
        <div className="flex flex-col p-2">
          <p className="font-bold text-lg">{subjectData.name}</p>
          <p className="text-gray-300">{subjectData.grade}</p>
        </div>
        <p className="p-2">{subjectData.year}</p>
      </div>
      <img
        src={subjectData.logo}
        className="w-1/2 h-full object-cover"
        alt={`${subjectData.name} logo`}
      />
    </div>

    <div className='w-2/3 flex items-center justify-evenly p-4'>
      <div className='bg-[#F8F2F2] flex w-3/4 h-full rounded-md'>
        <div className="w-14 h-12 rounded-full overflow-hidden ml-4 mr-2 mt-1 mb-1">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <input
          className='w-full bg-[#F8F2F2] p-2 rounded-sm ml-4 mr-4 focus:outline-none'
          placeholder='Say something to class...'
        />
      </div>
      <button className='bg-main2 rounded-md w-24 p-2 text-white hover:bg-main cursor-pointer'>send</button>
    </div>

    {/* Add a Stream Announcment Component */}
  </div>
);

export const HomeworkTab = ({ subjectData }) => (
  <div className="p-4 flex flex-col w-full items-center justify-center">
    <div className='flex flex-col w-full'>
      <div className='w-full flex items-center justify-between mb-4'>
        <p className='text-main font-bold text-3xl'>Homework</p>
        <button className='bg-main2 rounded-md text-white pr-4 pl-4 p-2 cursor-pointer hover:bg-main'>Add Homework</button>
      </div>

      <div className='w-full flex items-center justify-between'>
        <HWTable data={HomeworkData} />
      </div>
    </div>
  </div>
);


export const QuizzesTab = ({ subjectData }) => (
  <div className="p-4 flex flex-col w-full items-center justify-center overflow-auto">
    <div className='flex flex-col w-full'>
      <div className='w-full flex items-center justify-between mb-4'>
        <p className='text-main font-bold text-3xl'>Quizzes</p>
        <button className='bg-main2 rounded-md text-white pr-4 pl-4 p-2 cursor-pointer hover:bg-main'>Add Quiz</button>
      </div>

      <div className='w-full flex items-center justify-between'>
        <QuizTable data={sampleData} />
      </div>
    </div>

    <div className='flex flex-col w-full'>
      <div className='w-full flex items-center justify-between mb-4'>
        <p className='text-main font-bold text-3xl'>Live Quizzes</p>
        <button className='bg-main2 rounded-md text-white pr-4 pl-4 p-2 cursor-pointer hover:bg-main'>Add Live Quiz</button>
      </div>

      <div className='w-full flex items-center justify-between'>
        <QuizTable data={sampleData} />
      </div>
    </div>
  </div>
);

export const StudentsTab = ({ subjectData }) => (
<div className="p-4 flex flex-col w-full items-center justify-center">
    <div className='flex flex-col w-full'>
      <div className='w-full flex items-center justify-between mb-4'>
        <p className='text-main font-bold text-3xl'>Students</p>
      </div>

      <div className='w-full flex items-center justify-between'>
        <StuTable data={StuData} />
      </div>
    </div>
  </div>
);