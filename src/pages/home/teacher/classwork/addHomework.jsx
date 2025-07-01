import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Sidebar from '../../../components/teacherBar';
import back from '../../../../assets/back.svg';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useUser } from '../../../../userContext';

const Homework = () => {
  const { id: subjectId } = useParams();
  const navigate = useNavigate();
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [questionType, setQuestionType] = useState('single');
  const [homeworkId, setHomeworkId] = useState('');
  const [loadingId, setLoadingId] = useState(true);
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  const { user } = useUser();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectToggle = (index) => {
    if (questionType === 'single') {
      setCorrectAnswers([index]);
    } else {
      setCorrectAnswers((prev) =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    }
  };

  const resetQuestionForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswers([]);
    setQuestionType('single');
  };

  const validateQuestion = () => {
    if (!questionText.trim()) {
      toast.error('Question text cannot be empty.');
      return false;
    }
    const filledOptions = options.filter(opt => opt.trim() !== '');
    if (filledOptions.length < 2) {
      toast.error('At least two options are required.');
      return false;
    }
    if (correctAnswers.length === 0) {
      toast.error('Please select at least one correct answer.');
      return false;
    }
    return true;
  };

  const handleAddQuestion = () => {
    if (!validateQuestion()) return;

    const questionId = `q${(questions.length + 1).toString().padStart(2, '0')}`;
    const newQuestion = {
      id: questionId,
      text: questionText.trim(),
      options: options.map(opt => opt.trim()).filter(Boolean),
      correctAnswer: correctAnswers,
      type: questionType,
    };

    setQuestions([...questions, newQuestion]);
    toast.success(`Question ${questions.length + 1} added.`);
    resetQuestionForm();
  };

  const handleSaveHomework = async () => {
    if (!homeworkTitle.trim()) {
      toast.error('Homework title is required.');
      return;
    }

    if (!validateQuestion()) return;

    if (!homeworkId) {
      toast.error('Homework ID is not ready.');
      return;
    }

    const finalQuestion = {
      id: `q${questions.length + 1}`,
      text: questionText.trim(),
      options: options.map(opt => opt.trim()).filter(Boolean),
      correctAnswer: correctAnswers,
      type: questionType,
    };

    const allQuestions = [...questions, finalQuestion];

    try {
      const hwRef = doc(db, 'homeworks', subjectId, 'homeworks', homeworkId);

      await setDoc(hwRef, {
        title: homeworkTitle,
        description: description.trim(),
        difficulty,
        'time-posted': new Date(),
        homeworkID: homeworkId,
        type: 'challenge',
      });

      for (const question of allQuestions) {
        const qRef = doc(collection(hwRef, 'questions'), question.id);
        await setDoc(qRef, question);
      }

      toast.success('Homework saved successfully!');
      setHomeworkTitle('');
      setQuestions([]);
      resetQuestionForm();
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Failed to save homework.');
    }
  };

  // 🔧 Get next available homeworkId
  useEffect(() => {
    const fetchHomeworkId = async () => {
      try {
        const homeworksRef = collection(db, 'homeworks', subjectId, 'homeworks');
        const snapshot = await getDocs(homeworksRef);
        const existingIds = snapshot.docs.map(doc => doc.id);

        let nextId = 1;
        while (existingIds.includes(`hw${nextId}`)) {
          nextId++;
        }

        setHomeworkId(`hw${nextId}`);
      } catch (err) {
        console.error('Error fetching homework ID:', err);
        toast.error('Failed to generate homework ID.');
      } finally {
        setLoadingId(false);
      }
    };

    fetchHomeworkId();
  }, [subjectId]);

  return (
    <div className="w-full h-screen max-h-screen flex bg-white">
      <Sidebar userType="teacher" />
      <div className="w-4/5 text-blk p-4">
        <button
          className="w-60 flex items-center justify-between p-2 hover:underline hover:cursor-pointer"
          onClick={() => navigate("/teacher/classwork")}
        >
          <img src={back} className="w-5 h-5" />
          <p className="text-xl text-main">Back to all subjects</p>
        </button>

        {loadingId ? (
          <p className="text-gray-500">Loading homework ID...</p>
        ) : (
          <>
            <div className="p-4 w-full flex items-center justify-evenly">
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  Create Homework - {subjectId} ({homeworkId})
                </h1>

                <input
                  className="border p-2 w-full mb-4"
                  placeholder="Homework Title"
                  value={homeworkTitle}
                  onChange={(e) => setHomeworkTitle(e.target.value)}
                />

                <div className="mb-4">
                  <label className="block font-semibold mb-1">Question (Markdown Supported)</label>
                  <div className="rounded border [&_.w-md-editor-text]:resize-none">
                    <MDEditor
                      value={questionText}
                      onChange={setQuestionText}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      textareaProps={{ placeholder: 'Enter Markdown text here' }}
                      height={200}
                      visibleDragbar={false}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="font-semibold mr-4">Answer Type:</label>
                  <select
                    className="border p-2 rounded"
                    value={questionType}
                    onChange={(e) => {
                      setQuestionType(e.target.value);
                      setCorrectAnswers([]);
                    }}
                  >
                    <option value="single">Single Correct</option>
                    <option value="multiple">Multiple Correct</option>
                  </select>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type={questionType === 'single' ? 'radio' : 'checkbox'}
                        name="correctOption"
                        checked={correctAnswers.includes(i)}
                        onChange={() => handleCorrectToggle(i)}
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
                    onClick={handleSaveHomework}
                    className="bg-main2 text-white px-4 py-2 rounded hover:bg-main hover:cursor-pointer"
                  >
                    Finish & Save Homework
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

              <div className="flex flex-col items-center justify-center">
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Homework Description (Markdown Supported)</label>
                  <div className="rounded border [&_.w-md-editor-text]:resize-none">
                    <MDEditor
                      value={description}
                      onChange={setDescription}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      textareaProps={{ placeholder: 'Enter Markdown description here' }}
                      height={150}
                      visibleDragbar={false}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-1">Difficulty Level</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Homework;
