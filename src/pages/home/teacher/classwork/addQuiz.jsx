import React, { useState } from 'react';
import { db } from '../../../../lib/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Toaster, toast } from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import back from '../../../../assets/back.svg';
import Sidebar from '../../../components/teacherBar';
import rehypeSanitize from "rehype-sanitize";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useUser } from '../../../../userContext';

const CreateQuizPage = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { id: subjectId } = useParams();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [quizId] = useState(`quiz-${Date.now()}`);
  const [scheduledStartTime, setScheduledStartTime] = useState(null);

    const { user, loading } = useUser();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetQuestionForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(null);
  };

  const validateQuestion = () => {
    if (!questionText || !questionText.trim()) {
      toast.error('Question text cannot be empty.');
      return false;
    }

    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (filteredOptions.length < 2) {
      toast.error('At least two options are required.');
      return false;
    }

    if (
      correctAnswerIndex === null ||
      !options[correctAnswerIndex] ||
      !options[correctAnswerIndex].trim()
    ) {
      toast.error('You must select a valid correct answer.');
      return false;
    }

    return true;
  };

  const handleAddQuestion = () => {
    if (!validateQuestion()) return;

    const questionId = `q${(questions.length + 1).toString().padStart(2, '0')}`;

    const newQuestion = {
      id: questionId,
      question: questionText.trim(),
      options: options.map(opt => opt.trim()).filter(Boolean),
      correctAnswerIndex,
    };

    setQuestions([...questions, newQuestion]);
    toast.success(`Question ${questions.length + 1} added.`);
    resetQuestionForm();
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error('Quiz title is required.');
      return;
    }

    if (!scheduledStartTime) {
      toast.error('Please select a scheduled start time.');
      return;
    }

    if (!validateQuestion()) return;

    const finalQuestion = {
      id: `q${(questions.length + 1).toString().padStart(2, '0')}`,
      question: questionText.trim(),
      options: options.map(opt => opt.trim()).filter(Boolean),
      correctAnswerIndex,
    };

    const allQuestions = [...questions, finalQuestion];

    try {
      const quizRef = doc(db, 'quizzes', subjectId, 'quizzes', quizId);

      await setDoc(quizRef, {
        title: quizTitle,
        isActive: true,
        scheduledStartTime,
        xpDistributed: false,
        quizID: quizId,
        teacherID: user.teacher_id,// HERE
      });

      for (const question of allQuestions) {
        const questionRef = doc(collection(quizRef, 'questions'), question.id);
        await setDoc(questionRef, question);
      }

      toast.success('Quiz successfully saved to Firestore!');
      setQuizTitle('');
      setQuestions([]);
      resetQuestionForm();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz.');
    }
  };

  return (
    <div className='w-full h-screen max-h-screen flex bg-white'>
      <Toaster position="top-right" />
      <Sidebar userType='teacher' />

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 text-blk">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Upload</h2>
            <p className="mb-6">
              You're about to upload <strong>{questions.length + 1}</strong> question
              {questions.length !== 0 ? 's' : ''} to your students.
              <br />
              Do you want to proceed?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-red-300 rounded hover:bg-red-400 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowConfirmModal(false);
                  await handleSaveQuiz();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 hover:cursor-pointer"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-3/5 text-blk">
        <div>
          <button
            className="w-60 flex items-center justify-between p-2 hover:underline hover:cursor-pointer"
            onClick={() => navigate(`/teacher/classwork`)}
          >
            <img src={back} className="w-5 h-5" />
            <p className="text-xl text-main">Back to all subjects</p>
          </button>
        </div>

        <div className='p-2 ml-8 w-full flex flex-col items-center justify-evenly'>
          <h1 className="text-2xl font-bold mb-4">Create Quiz - {subjectId}</h1>

          <input
            className="border p-2 w-full mb-4"
            placeholder="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />

          <div className="mb-4 w-full">
            <label className="block font-semibold mb-1">Scheduled Start Time</label>
            <div className="relative w-full">
              <DatePicker
                selected={scheduledStartTime}
                onChange={(date) => setScheduledStartTime(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                className="border p-2 w-full rounded"
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 absolute right-3 top-3 pointer-events-none text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="block font-semibold mb-1">Question (Markdown Supported)</label>
            <div className="rounded border [&_.w-md-editor-text]:resize-none">
              <MDEditor
                value={questionText}
                onChange={setQuestionText}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                textareaProps={{
                  placeholder: 'Please enter Markdown text',
                }}
                height={200}
                visibleDragbar={false}
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctAnswerIndex === i}
                  onChange={() => setCorrectAnswerIndex(i)}
                />
                <input
                  className="border p-2 w-full"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="bg-main2 text-white px-4 py-2 rounded hover:bg-main hover:cursor-pointer"
            >
              Finish & Save Quiz
            </button>
            <button
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
            >
              Add Question
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {questions.length} question{questions.length !== 1 ? 's' : ''} added so far.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
