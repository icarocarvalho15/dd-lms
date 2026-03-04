import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Navbar />
                  <div className="pt-16"><CourseList /></div>
                </>
            </ProtectedRoute>
          } />
          <Route path="/curso/:slug" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;