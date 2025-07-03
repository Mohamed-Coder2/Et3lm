import React, { useEffect, useState } from 'react';
import { QuizTable, HWTable, StuTable } from '../../../components/table';
import { getFirestore, doc, setDoc, collection, getDocs, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import default_logo from '../../../../assets/default-avatar.png';
import { v4 as uuidv4 } from "uuid";

export const StreamTab = ({ subjectData, user }) => {
  const [announcementText, setAnnouncementText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState(null);
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  console.log(subjectData)
  console.log(user)

  // Fetch announcements
  useEffect(() => {
    const q = query(
      collection(db, 'subjects', subjectData.subject_id, 'announcements'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(results);
    });

    return () => unsubscribe();
  }, [subjectData.subject_id]);

  const handlePostAnnouncement = async () => {
    const trimmed = announcementText.trim();
    if (!trimmed) {
      toast.error('Announcement cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(
        collection(db, 'subjects', subjectData.subject_id, 'announcements'),
        {
          message: trimmed,
          createdAt: serverTimestamp(),
          teacherName: user.name || 'Unnamed Teacher',
          teacherId: user.teacher_id,
          profilePicture: user.profilePicture || default_logo,
        }
      );

      toast.success('Announcement sent!');
      setAnnouncementText('');
    } catch (error) {
      console.error('Error posting announcement:', error);
      toast.error('Failed to send announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComments = async (announcementId) => {
    const isExpanded = expandedAnnouncementId === announcementId;
    if (isExpanded) {
      setExpandedAnnouncementId(null);
    } else {
      setExpandedAnnouncementId(announcementId);

      if (!comments[announcementId]) {
        setLoadingComments((prev) => ({ ...prev, [announcementId]: true }));

        try {
          const commentsSnapshot = await getDocs(
            collection(
              db,
              'subjects',
              subjectData.subject_id,
              'announcements',
              announcementId,
              'comments'
            )
          );

          const commentsData = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setComments((prev) => ({ ...prev, [announcementId]: commentsData }));
        } catch (err) {
          console.error('Failed to fetch comments', err);
          toast.error('Failed to load comments');
        } finally {
          setLoadingComments((prev) => ({ ...prev, [announcementId]: false }));
        }
      }
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <Toaster position="top-right" />

      {/* Subject Header */}
      <div className="w-2/3 h-30 flex items-center justify-between rounded-lg text-white bg-main2">
        <div className="p-2 flex flex-col justify-evenly h-full">
          <div className="flex flex-col p-2">
            <p className="font-bold text-lg">{subjectData.name}</p>
            <p className="text-gray-300">{subjectData.subject_id}</p>
          </div>
          <p className="p-2">{subjectData.description}</p>
        </div>
        <img
          src={subjectData.logo}
          className="w-1/2 h-full object-cover"
          alt={`${subjectData.name} logo`}
        />
      </div>

      {/* Input Field */}
      <div className="w-2/3 flex items-center justify-evenly p-4">
        <div className="bg-[#F8F2F2] flex w-3/4 h-full rounded-md">
          <div className="w-14 h-12 rounded-full overflow-hidden ml-4 mr-2 mt-1 mb-1">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <input
            className="w-full bg-[#F8F2F2] p-2 rounded-sm ml-4 mr-4 focus:outline-none"
            placeholder="Say something to class..."
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePostAnnouncement()}
            disabled={isSubmitting}
          />
        </div>
        <button
          className={`bg-main2 rounded-md w-24 p-2 text-white hover:bg-main ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          onClick={handlePostAnnouncement}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* Announcements List */}
      <div className="w-2/3 mt-4 space-y-4">
        {announcements.length === 0 && (
          <p className="text-center text-gray-500">No announcements yet.</p>
        )}
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-[#F3F3F3] rounded-md p-4 flex flex-col shadow-sm hover:bg-[#b4b4b4]">
            <div
              className="flex gap-4 cursor-pointer"
              onClick={() => handleToggleComments(ann.id)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={ann.profilePicture}
                  alt="Teacher"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{ann.teacherName}</p>
                  {ann.createdAt?.toDate && (
                    <span className="text-xs text-gray-500">
                      • {formatDistanceToNow(ann.createdAt.toDate(), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className="text-gray-800 mt-1">{ann.message}</p>
              </div>
            </div>

            {/* Comments Section */}
            {expandedAnnouncementId === ann.id && (
              <div className="mt-3 ml-14">
                {loadingComments[ann.id] ? (
                  <p className="text-sm text-gray-500">Loading comments...</p>
                ) : (
                  <>
                    {comments[ann.id]?.length > 0 ? (
                      <div className="space-y-2">
                        {comments[ann.id].map((comment) => (
                          <div key={comment.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img
                                src={comment.authorAvatar}
                                alt="Student"
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="text-sm font-semibold">{comment.authorName}</p>
                                {comment.createdAt?.toDate && (
                                  <span className="text-xs text-gray-400">
                                    •{' '}
                                    {formatDistanceToNow(comment.createdAt.toDate(), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{comment.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet.</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const HomeworkTab = ({ subjectData }) => {
  const navigate = useNavigate();
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [selectedHW, setSelectedHW] = useState(null);
  const [showGrades, setShowGrades] = useState(false);

  const handleViewGrades = async (hwId) => {
    try {
      const gradesRef = collection(
        db,
        "homeworks",
        subjectData.subject_id,
        "homeworks",
        hwId,
        "participantGrades"
      );
      const snapshot = await getDocs(gradesRef);

      const formattedGrades = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          answers: data.answers,
          percentage: data.percentage,
          score: data.score,
          stars: data.stars,
          submittedAt: data.submittedAt?.toDate().toLocaleString() || "N/A",
        };
      });

      const hwTitle = homeworkData.find(h => h.id === hwId)?.title || hwId;

      setGrades(formattedGrades);
      setSelectedHW(hwTitle);
      setShowGrades(true);
    } catch (err) {
      console.error("Error fetching grades:", err);
      toast.error("Failed to load homework grades.");
    }
  };

  useEffect(() => {
    const fetchHomeworks = async () => {
      const loadingToast = toast.loading('Fetching homeworks...');
      try {
        const hwRef = collection(db, 'homeworks', subjectData.subject_id, 'homeworks');
        const snapshot = await getDocs(hwRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHomeworkData(data);
        localStorage.setItem("teacherTotalHomeworks", data.length);
        toast.success('Homeworks loaded.', { id: loadingToast });
      } catch (error) {
        console.error('Error loading homeworks:', error);
        toast.error('Failed to load homeworks.', { id: loadingToast });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [subjectData.subject_id]);

  return (
    <div className="p-4 flex flex-col w-full items-center justify-center">
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center justify-between mb-4">
          <p className="text-main font-bold text-3xl">Homework</p>
          <button
            onClick={() =>
              navigate(`/teacher/classwork/${subjectData.subject_id}/homework`)
            }
            className="bg-main2 rounded-md text-white px-4 py-2 cursor-pointer hover:bg-main"
          >
            Add Homework
          </button>
        </div>

        <div className="w-full">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <HWTable data={homeworkData} onViewGrades={handleViewGrades} />
          )}
        </div>
      </div>

      {/* Grades Modal */}
      {showGrades && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[50%] max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Grades for Homework: {selectedHW}</h2>
              <button
                className="text-red-500 font-bold"
                onClick={() => setShowGrades(false)}
              >
                Close
              </button>
            </div>

            {grades.length === 0 ? (
              <p>No grades found.</p>
            ) : (
              <table className="w-full text-left text-sm border">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2">Student ID</th>
                    <th className="p-2">Score</th>
                    <th className="p-2">Percentage</th>
                    <th className="p-2">Stars</th>
                    <th className="p-2">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g.id} className="border-b">
                      <td className="p-2">{g.id}</td>
                      <td className="p-2">{g.score}</td>
                      <td className="p-2">{g.percentage}%</td>
                      <td className="p-2">{g.stars}</td>
                      <td className="p-2">{g.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const QuizzesTab = ({ subjectData }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [grades, setGrades] = useState([]);
  const [showGrades, setShowGrades] = useState(false);

  const handleViewGrades = async (quizId) => {
    try {
      const gradesRef = collection(
        db,
        "quizzes",
        subjectData.subject_id,
        "quizzes",
        quizId,
        "participantGrades"
      );
      const snapshot = await getDocs(gradesRef);

      const formattedGrades = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          answers: data.answers,
          percentage: data.percentage,
          score: data.score,
          submittedAt: data.submittedAt?.toDate().toLocaleString() || "N/A",
        };
      });

      const quizTitle = quizzes.find(q => q.id === quizId)?.title || quizId;

      setGrades(formattedGrades);
      setSelectedQuiz(quizTitle);
      setShowGrades(true);
    } catch (err) {
      console.error("Error fetching grades:", err);
      toast.error("Failed to load grades.");
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      const fetchPromise = (async () => {
        try {
          const subject_Id = subjectData.subject_id;
          const quizzesRef = collection(db, "quizzes", subject_Id, "quizzes");
          const snapshot = await getDocs(quizzesRef);

          const formattedQuizzes = snapshot.docs.map(doc => {
            const data = doc.data();
            const dateObj = data.scheduledStartTime?.toDate();

            return {
              q: doc.questions,
              id: data.quizID,
              title: data.title || "Untitled",
              issueDate: dateObj
                ? `${dateObj.getDate()}/${(dateObj.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${dateObj.getFullYear()}`
                : "N/A",
              status: (() => {
                const now = new Date();
                const startTime = data.scheduledStartTime?.toDate();

                if (!startTime) return "Not available";

                const diffMs = startTime.getTime() - now.getTime();
                const diffMin = diffMs / (1000 * 60);

                if (diffMin > 30) return "Not available";
                if (diffMin <= 30 && diffMin > 0) return "Starting Soon";
                if (diffMin <= 0 && diffMin >= -5) return "Running";
                return "Finished";
              })(),
              time: data.scheduledStartTime?.toDate().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }) || "N/A"
            };
          });

          setQuizzes(formattedQuizzes);
          localStorage.setItem("teacherTotalQuizzes", formattedQuizzes.length);
        } catch (err) {
          throw err;
        }
      })();

      toast.promise(fetchPromise, {
        loading: 'Loading quizzes...',
        success: 'Quizzes loaded!',
        error: 'Failed to load quizzes.',
      });
    };

    if (subjectData.subject_id !== null) {
      fetchQuizzes();
    }
  }, [subjectData]);

  return (
    <>
      <div className="p-4 flex flex-col w-full items-center justify-center overflow-auto">
        <div className='flex flex-col w-full'>
          <div className='w-full flex items-center justify-between mb-4'>
            <p className='text-main font-bold text-3xl'>Quizzes</p>
            <button
              onClick={() => {
                navigate(`/teacher/classwork/${subjectData.subject_id}/create`);
              }}
              className='bg-main2 rounded-md text-white pr-4 pl-4 p-2 cursor-pointer hover:bg-main'
            >
              Add Quiz
            </button>
          </div>

          <div className='w-full flex items-center justify-between'>
            <QuizTable data={quizzes} onViewGrades={handleViewGrades} />
          </div>
        </div>
      </div>

      {showGrades && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[50%] max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Grades for Quiz: {selectedQuiz}</h2>
              <button
                className="text-red-500 font-bold"
                onClick={() => setShowGrades(false)}
              >
                Close
              </button>
            </div>

            {grades.length === 0 ? (
              <p>No grades found.</p>
            ) : (
              <table className="w-full text-left text-sm border">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2">Student ID</th>
                    <th className="p-2">Score</th>
                    <th className="p-2">Percentage</th>
                    <th className="p-2">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g.id} className="border-b">
                      <td className="p-2">{g.id}</td>
                      <td className="p-2">{g.score}</td>
                      <td className="p-2">{g.percentage}%</td>
                      <td className="p-2">{g.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const StudentsTab = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const fetchPromise = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students`, {
        headers: {
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true"
        }
      });

      toast.promise(fetchPromise, {
        loading: 'Loading students...',
        success: 'Students loaded!',
        error: 'Failed to load students.',
      });

      try {
        const res = await fetchPromise;
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const raw = await res.text();
          throw new Error(`Expected JSON, got:\n${raw}`);
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.data.students)) {
          const formattedStudents = data.data.students.map(student => ({
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
            email: student.email,
            class_id: student.class_id,
            image: student.image,
            class: student.class
          }));

          setStudents(formattedStudents);
          localStorage.setItem("teacherTotalStudents", formattedStudents.length);
        }

      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (

    <>
      <Toaster position="top-right" />
      <div className="p-4 flex flex-col w-full items-center justify-center">
        <div className='flex flex-col w-full'>
          <div className='w-full flex items-center justify-between mb-4'>
            <p className='text-main font-bold text-3xl'>Students</p>
          </div>
          <div className='w-full flex items-center justify-between'>
            <StuTable data={students} />
          </div>
        </div>
      </div>
    </>
  );
};

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/da3ha0efp/auto/upload';
const UPLOAD_PRESET = 'unsigned_preset';

export const MaterialTab = ({ subjectData }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unitId, setUnitId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Cloudinary error:", data);
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      return data.secure_url;
    } catch (err) {
      console.log("Cloudinary upload failed:", err);
      throw err;
    }
  };

  const saveToFirestore = async (cloudinaryUrl) => {
    const db = getFirestore();
    const materialId = uuidv4();

    const materialRef = doc(
      db,
      "content",
      subjectData.subject_id,
      "content",
      unitId,
      "lessons",
      lessonId,
      "material",
      materialId
    );

    await setDoc(materialRef, {
      title,
      description,
      type: "pdf",
      url: cloudinaryUrl,
      createdAt: serverTimestamp(),
    });
  };

  const handleSubmit = async () => {
    if (!file || !title || !unitId || !lessonId) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Uploading material...");

      const cloudinaryUrl = await uploadToCloudinary(file);
      await saveToFirestore(cloudinaryUrl);

      toast.dismiss();
      toast.success("Material uploaded successfully!");

      setFile(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.log("Upload failed:", err);
      toast.dismiss();
      toast.error("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Teaching Material</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit Name <span className="text-red-500">*</span>
          </label>
          <input
            id="unit"
            type="text"
            placeholder="e.g. Unit 1: Introduction"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="lesson" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lesson"
            type="text"
            placeholder="e.g. Lesson 1: Basics"
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Material Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter material title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            placeholder="Enter a brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF File <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              {file && (
                <p className="text-xs text-green-600 mt-2">
                  Selected: {file.name}
                </p>
              )}
              <p className="text-xs text-gray-500">PDF up to 10MB</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            uploading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : 'Upload Material'}
        </button>
      </div>
    </div>
  );
};

export const SchedulesTab = ({ subjectData }) => {
  return(
    <div>
      <h1>Schedules for {subjectData.subject_id}</h1>
    </div>
  )
}