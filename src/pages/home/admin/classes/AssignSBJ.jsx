import React, { useState, useEffect } from 'react';
import Sidebar from "../../../components/sidebar";
import toast from 'react-hot-toast';

const AssignSBJ = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  const safeFetch = async (url, options = {}) => {
    const defaultHeaders = {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed (${response.status}): ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  // Fetch classes and subjects on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [classesData, subjectsData] = await Promise.all([
          safeFetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes`),
          safeFetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`)
        ]);

        setClasses(classesData.data?.classes || []);
        setSubjects(subjectsData.data || []);
      } catch (error) {
        console.error('Initial data loading error:', error);
        toast.error(`Failed to load initial data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch teachers when subject changes
  useEffect(() => {
    const fetchTeachersForSubject = async () => {
      if (!selectedSubjectId) {
        setTeachers([]);
        setSubjectName('');
        setSelectedTeacherId('');
        return;
      }

      setIsLoading(true);
      try {
        const response = await safeFetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/teacher-subjects/subject/${selectedSubjectId}/teachers`
        );
        
        // Set both the subject name and teachers list
        setSubjectName(response.subject || '');
        setTeachers(response.teachers || []);
        
        // If there's only one teacher, auto-select them
        if (response.teachers?.length === 1) {
          setSelectedTeacherId(response.teachers[0].id.toString());
        }
      } catch (error) {
        console.error('Teachers loading error:', error);
        toast.error(`Failed to load teachers: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachersForSubject();
  }, [selectedSubjectId]);

  const handleAssign = async () => {
    if (!selectedClassId || !selectedSubjectId || !selectedTeacherId) {
      toast.error('Please select a class, subject, and teacher');
      return;
    }

    const loadingToast = toast.loading('Assigning teacher to class with subject...');
    try {
      await safeFetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/class-subjects/assign`,
        {
          method: 'POST',
          body: {
            class_id: Number(selectedClassId),
            subject_id: Number(selectedSubjectId),
            teacher_id: Number(selectedTeacherId)
          }
        }
      );

      toast.success('Assignment successful!', { id: loadingToast });
      // Reset selections
      setSelectedClassId('');
      setSelectedSubjectId('');
      setSelectedTeacherId('');
      setSubjectName('');
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error(`Error: ${error.message}`, { id: loadingToast });
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar userType="admin" />
      
      <div className="flex-1 p-8 text-blk">
        <h1 className="text-2xl font-bold mb-8">Assign Teacher to Class with Subject</h1>
        
        <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg shadow">
          {isLoading ? (
            <div className="text-center py-4">Loading data...</div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} (Students: {cls.numberOfStudents})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a subject --</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subject_name} ({subject.subject_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {subjectName ? `Teachers for ${subjectName}` : 'Select Teacher'}
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  disabled={!selectedSubjectId || teachers.length === 0}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">-- Select a teacher --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name} ({teacher.email})
                    </option>
                  ))}
                </select>
                {!selectedSubjectId ? (
                  <p className="text-xs text-gray-500 mt-1">Please select a subject first</p>
                ) : teachers.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No teachers available for this subject</p>
                )}
              </div>

              <button
                onClick={handleAssign}
                disabled={!selectedClassId || !selectedSubjectId || !selectedTeacherId || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Assign Teacher'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignSBJ;