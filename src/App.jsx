import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Dashboard from './pages/home/admin/dashboard';
import Users from './pages/home/admin/users/users';
import Subjects from './pages/home/admin/subjects/subjects';
import Classes from './pages/home/admin/classes/classes';
import Messages from './pages/home/admin/messages/messages';
import Notifications from './pages/home/admin/notifications/notifications';
import Profile from './pages/home/admin/profile/profile';
import EditUser from './pages/home/admin/users/userProfile';
import EditSubject from './pages/home/admin/subjects/Subject';
import AddSubject from './pages/home/admin/subjects/addSubject';
import Addclass from './pages/home/admin/classes/AddClass';
import Editclass from './pages/home/admin/classes/EditClass';

import TeacherDashboard from './pages/home/teacher/dashboard';
import ClassWork from './pages/home/teacher/classwork/classwork';
import TeacherMessages from './pages/home/teacher/messages/messages';
import TeacherNotification from './pages/home/teacher/notifications/TeacherNotification';
import TeacherProfile from './pages/home/teacher/profile/teacherProfile';

import ClassWorkEdit from './pages/home/teacher/classwork/classworkEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        
        <Route path='/admin/users' element={<Users />} />
        <Route path='/admin/subjects' element={<Subjects />} />
        <Route path='/admin/classes' element={<Classes />} />
        <Route path='/admin/messages' element={<Messages />} />
        <Route path='/admin/notifications' element={<Notifications />} />
        <Route path='/admin/profile' element={<Profile />} />
        
        <Route path='/admin/users/edit/:id' element={<EditUser />} />
        <Route path='/admin/subjects/edit/:id' element={<EditSubject />} />
        <Route path='/admin/classes/edit/:id' element={<Editclass />} />
        
        <Route path='/admin/subjects/add' element={<AddSubject />} />
        <Route path='/admin/classes/add' element={<Addclass />} />

        <Route path='/teacher/dashboard' element={<TeacherDashboard />} />

        <Route path='/teacher/classwork' element={<ClassWork />} />
        <Route path='/teacher/messages' element={<TeacherMessages />} />
        <Route path='/teacher/notifications' element={<TeacherNotification />} />
        <Route path='/teacher/profile' element={<TeacherProfile />} />

        <Route path='/teacher/classwork/:id' element={<ClassWorkEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
