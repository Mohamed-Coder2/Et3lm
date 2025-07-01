import React, { useEffect, useState } from 'react';
import { QuizTable, HWTable, StuTable } from '../../../components/table';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import default_logo from '../../../../assets/default-avatar.png';

const HomeworkData = [
  { lvl: "01", title: "aaaaa", issueDate: "15/3/2025" },
  { lvl: "02", title: "aaaaa", issueDate: "15/3/2025" },
  { lvl: "03", title: "aaaaa", issueDate: "15/3/2025" },
  { lvl: "04", title: "aaaaa", issueDate: "15/3/2025" },
];

export const StreamTab = ({ subjectData, user }) => {
  const [announcementText, setAnnouncementText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState(null);
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

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

  useEffect(() => {
    const fetchHomeworks = async () => {
      const loadingToast = toast.loading('Fetching homeworks...');
      try {
        const hwRef = collection(db, 'homeworks', subjectData.subject_id, 'homeworks');
        const snapshot = await getDocs(hwRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHomeworkData(data);
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
            <HWTable data={homeworkData} />
          )}
        </div>
      </div>
    </div>
  );
};

export const QuizzesTab = ({ subjectData }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

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
              unit: doc.id,
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
      <Toaster position="top-right" />
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
            <QuizTable data={quizzes} />
          </div>
        </div>
      </div>
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
