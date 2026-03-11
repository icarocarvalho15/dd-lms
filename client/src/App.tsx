import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api/axios';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import Dashboard from './pages/Dashboard';
import InstructorCourses from './pages/InstructorCourses';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import Profile from './pages/Profile';

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

function App() {
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get<UserResponse>('/me');
          localStorage.setItem('userRole', res.data.role);
          localStorage.setItem('userName', res.data.name);
        } catch {
          console.warn("Sessão inválida, limpando dados...");
          localStorage.clear();
        }
      }
      setIsVerifying(false);
    };
    verifyToken();
  }, []);
  
  if (isVerifying) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className=" text-blue-600 font-bold animate-pulse">
            DravDev Academy...
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
          <Route path="/" element={<CourseList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/curso/:slug" element={<CourseDetails />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['instrutor', 'admin']} />}>
          <Route path="/instrutor/meus-cursos" element={<InstructorCourses />} />
          <Route path="/instrutor/novo-curso" element={<CreateCourse />} />
          <Route path="/instrutor/editar/:slug" element={<EditCourse />} />
        </Route>
        <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;

