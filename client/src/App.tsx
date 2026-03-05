import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/me');
          localStorage.setItem('userRole', res.data.role);
          localStorage.setItem('userName', res.data.name);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
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
          <span className="italic text-blue-600 font-bold animate-pulse">
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
        <Route path="/" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/curso/:slug" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
        <Route path="/instrutor/meus-cursos" element={<ProtectedRoute><InstructorCourses /></ProtectedRoute>} />
        <Route path="/instrutor/novo-curso" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="/instrutor/editar/:slug" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;