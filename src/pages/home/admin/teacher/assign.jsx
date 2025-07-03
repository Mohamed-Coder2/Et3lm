import React, { useState, useEffect } from 'react';
import Sidebar from "../../../components/sidebar";
import toast from 'react-hot-toast';

const Assign = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [teachersData, subjectsData] = await Promise.all([
          safeFetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers`),
          safeFetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`)
        ]);

        setTeachers(teachersData.data || []);
        setSubjects(subjectsData.data || []);
      } catch (error) {
        console.error('Data loading error:', error);
        toast.error(`Failed to load data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedTeacherId || !selectedSubjectId) {
      toast.error('Please select both a teacher and a subject');
      return;
    }

    const loadingToast = toast.loading('Assigning subject to teacher...');
    try {
      // Convert string values to numbers explicitly
      const teacherId = Number(selectedTeacherId);
      const subjectId = Number(selectedSubjectId);

      // Verify conversion was successful
      if (isNaN(teacherId) || isNaN(subjectId)) {
        throw new Error('Invalid teacher or subject ID');
      }

      const responseData = await safeFetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher-subjects/assign`,
        {
          method: 'POST',
          body: {
            teacher_id: teacherId,  // Send as number
            subject_id: subjectId  // Send as number
          }
        }
      );

      toast.success(responseData.message || 'Subject assigned successfully!', { id: loadingToast });
      setSelectedTeacherId('');
      setSelectedSubjectId('');
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error(`Error: ${error.message}`, { id: loadingToast });
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar userType='admin' />
      
      <div className="flex-1 p-8 text-blk">
        <h1 className="text-2xl font-bold mb-8">Assign Subject to Teacher</h1>
        
        <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg shadow">
          {isLoading ? (
            <div className="text-center py-4">Loading data...</div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Teacher
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a teacher --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
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

              <button
                onClick={handleAssign}
                disabled={!selectedTeacherId || !selectedSubjectId || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Assign Subject'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assign;