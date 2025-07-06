import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import axios from "axios";
import toast from "react-hot-toast";

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"
];

const generateTimeSlots = () => {
  const slots = [];
  let hour = 8;
  let minute = 0;

  for (let i = 0; i < 12; i++) {
    const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    let endHour = hour;
    let endMinute = minute + 55;
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }

    const end = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
    slots.push({ start_time: start, end_time: end, is_break: false });

    // Advance to next slot (add 5-minute break)
    minute += 60;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }
  }

  return slots;
};

const defaultSlots = generateTimeSlots();

const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [subjectsWithTeachers, setSubjectsWithTeachers] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingSchedule, setFetchingSchedule] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const headers = { "ngrok-skip-browser-warning": "true" };

  useEffect(() => {
    axios.get(`${BASE_URL}/api/classes`, { headers })
      .then(res => setClasses(res.data.data.classes))
      .catch(() => toast.error("Failed to fetch classes"));
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    setFetchingSchedule(true);
    
    // Fetch subjects for the class
    axios.get(`${BASE_URL}/api/class-subjects/class/${selectedClassId}/subjects`, { headers })
      .then(res => setSubjectsWithTeachers(res.data.subjects))
      .catch(() => toast.error("Failed to fetch subjects"));

    // Fetch existing schedule for the class
    axios.get(`${BASE_URL}/api/schedules/class/${selectedClassId}`, { headers })
      .then(res => {
        const fetchedSchedule = res.data.data.schedule;
        
        // Initialize schedule with default slots first
        const newSchedule = {};
        daysOfWeek.forEach(day => {
          newSchedule[day] = generateTimeSlots();
        });

        // Process fetched data to remove duplicates and keep the most relevant entry
        Object.entries(fetchedSchedule).forEach(([day, slots]) => {
          if (daysOfWeek.includes(day)) {
            // Create a map to store the most relevant slot for each time period
            const timeSlotMap = new Map();
            
            // Process all slots for this day
            slots.forEach(slot => {
              const timeKey = `${slot.start_time}-${slot.end_time}`;
              
              // Only keep the slot if it has subject data or if no slot exists for this time yet
              if (slot.subject_id || !timeSlotMap.has(timeKey)) {
                timeSlotMap.set(timeKey, {
                  start_time: slot.start_time,
                  end_time: slot.end_time,
                  is_break: slot.is_break,
                  subject_id: slot.subject_id || null,
                  teacher_id: slot.teacher_id || null
                });
              }
            });

            // Convert the map back to an array and sort by time
            const uniqueSlots = Array.from(timeSlotMap.values())
              .sort((a, b) => a.start_time.localeCompare(b.start_time));

            // Merge with default slots
            newSchedule[day] = newSchedule[day].map(defaultSlot => {
              const matchedSlot = uniqueSlots.find(s => 
                s.start_time === defaultSlot.start_time && 
                s.end_time === defaultSlot.end_time
              );
              return matchedSlot || defaultSlot;
            });
          }
        });

        setSchedule(newSchedule);
      })
      .catch(() => {
        // If no schedule exists, initialize with empty slots
        const newSchedule = {};
        daysOfWeek.forEach(day => {
          newSchedule[day] = generateTimeSlots();
        });
        setSchedule(newSchedule);
      })
      .finally(() => setFetchingSchedule(false));
  }, [selectedClassId]);

  // ... rest of the component code remains the same ...
  const handleChange = (day, index, key, value) => {
    const daySchedule = [...(schedule[day] || defaultSlots)];
    let slot = { ...daySchedule[index] };

    if (key === "is_break" && value) {
      slot = { ...slot, is_break: true, subject_id: null, teacher_id: null };
    } else if (key === "subject_id") {
      const subj = subjectsWithTeachers.find(s => s.id === parseInt(value));
      slot = {
        ...slot,
        subject_id: subj?.id || null,
        teacher_id: subj?.teacher?.id || null,
        is_break: false,
      };
    } else {
      slot = { ...slot, [key]: value };
    }

    daySchedule[index] = slot;
    setSchedule(prev => ({ ...prev, [day]: daySchedule }));
  };

  const handleSubmit = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class.");
      return;
    }

    setLoading(true);

    const allSchedules = Object.entries(schedule)
      .filter(([, slots]) =>
        slots.some(slot => slot.subject_id || slot.is_break)
      )
      .flatMap(([day, slots]) =>
        slots.map(slot => ({
          day_of_week: day,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_break: !!slot.is_break,
          subject_id: slot.is_break ? null : slot.subject_id || null,
          teacher_id: slot.is_break ? null : slot.teacher_id || null,
        }))
      );

    const payload = {
      class_id: selectedClassId,
      semester: 1,
      academic_year: 2025,
      schedules: allSchedules,
    };

    try {
      await axios.post(`${BASE_URL}/api/schedules/bulk`, payload);
      toast.success("Schedule submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex bg-gray-50 min-h-screen">
      <Sidebar userType="admin" />

      <div className="flex-1 flex flex-col overflow-hidden text-blk relative">
        <div className="sticky top-0 bg-gray-50 z-10 p-8 pb-4 border-b">
          <h1 className="text-3xl font-bold mb-2">Assign Weekly Schedule</h1>
          <div className="mb-4 flex items-center gap-4">
            <label className="font-semibold">Select Class:</label>
            <select
              className="border p-2 rounded w-64"
              value={selectedClassId || ""}
              onChange={(e) => setSelectedClassId(parseInt(e.target.value))}
            >
              <option value="">-- Choose Class --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedClassId && (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Please select a class to begin scheduling.
          </div>
        )}

        {fetchingSchedule && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 text-lg">Loading schedule...</div>
          </div>
        )}

        {selectedClassId && !fetchingSchedule && (
          <div className="flex flex-col" style={{ height: 'calc(100vh - 155px)' }}>
            <div className="overflow-y-auto px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {daysOfWeek.map((day) => (
                  <div key={day} className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-3 text-blue-700">{day}</h2>
                    <div className="grid grid-cols-6 gap-2 font-semibold text-sm mb-2">
                      <span>Start</span>
                      <span>End</span>
                      <span>Subject</span>
                      <span>Teacher</span>
                      <span>Break?</span>
                      <span>Type</span>
                    </div>
                    {(schedule[day] || defaultSlots).map((slot, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-6 gap-2 items-center mb-1 rounded ${slot.is_break ? "bg-yellow-50" : "bg-blue-50"
                          }`}
                      >
                        <input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) =>
                            handleChange(day, i, "start_time", e.target.value)
                          }
                          className="border p-1 rounded"
                        />
                        <input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) =>
                            handleChange(day, i, "end_time", e.target.value)
                          }
                          className="border p-1 rounded"
                        />
                        <select
                          disabled={slot.is_break}
                          value={slot.subject_id || ""}
                          onChange={(e) =>
                            handleChange(day, i, "subject_id", parseInt(e.target.value))
                          }
                          className="border p-1 rounded"
                        >
                          <option value="">-- Subject --</option>
                          {subjectsWithTeachers.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.subject_name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          disabled
                          value={
                            slot.is_break
                              ? ""
                              : subjectsWithTeachers.find((s) => s.id === slot.subject_id)
                                ?.teacher?.name || ""
                          }
                          className="border p-1 rounded bg-gray-100"
                        />
                        <input
                          type="checkbox"
                          checked={slot.is_break}
                          onChange={(e) =>
                            handleChange(day, i, "is_break", e.target.checked)
                          }
                        />
                        <span
                          className={`text-xs ${slot.is_break ? "text-yellow-600" : "text-blue-600"
                            }`}
                        >
                          {slot.is_break ? "Break" : "Class"}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-gray-100 border-t p-4 flex justify-center z-10">
              <button
                className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Schedule"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;